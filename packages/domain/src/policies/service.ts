import { ok, err, type Result } from '../result.js';
import { ValidationError, ConflictError, NotFoundError, ForbiddenError } from '../errors.js';
import type { Policy, CreatePolicyInput, UpdatePolicyInput, PolicyFilter } from './types.js';
import type { PolicyRepository } from './repository.js';

export class PolicyService {
  constructor(private readonly repo: PolicyRepository) {}

  // Rule: Policies evaluate allow/deny
  // Rule: Priority order matters

  async create(input: CreatePolicyInput): Promise<Result<Policy, Error>> {
    if (!input.organizationId?.trim()) {
      return err(new ValidationError('organizationId is required'));
    }
    if (!input.name?.trim()) {
      return err(new ValidationError('name is required'));
    }
    const existing = await this.repo.findByName(input.organizationId, input.name);
    if (existing) {
      return err(new ConflictError(`policies already exists: ${input.name}`));
    }
    const created = await this.repo.create({
      ...input,
      name: input.name.trim(),
      status: input.status ?? 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return ok(created);
  }

  async get(organizationId: string, id: string): Promise<Result<Policy, Error>> {
    const row = await this.repo.findById(organizationId, id);
    if (!row) return err(new NotFoundError('Policy not found'));
    return ok(row);
  }

  async list(filter: PolicyFilter): Promise<Result<Policy[], Error>> {
    if (!filter.organizationId) {
      return err(new ValidationError('organizationId is required'));
    }
    const rows = await this.repo.list(filter);
    return ok(rows);
  }

  async update(
    organizationId: string,
    id: string,
    input: UpdatePolicyInput,
    actorRole: string,
  ): Promise<Result<Policy, Error>> {
    if (!['owner', 'admin', 'manager'].includes(actorRole)) {
      return err(new ForbiddenError('insufficient role to update policies'));
    }
    const current = await this.repo.findById(organizationId, id);
    if (!current) return err(new NotFoundError('Policy not found'));
    const updated = await this.repo.update(organizationId, id, {
      ...input,
      updatedAt: new Date().toISOString(),
    });
    return ok(updated);
  }

  async archive(
    organizationId: string,
    id: string,
    actorRole: string,
  ): Promise<Result<Policy, Error>> {
    if (!['owner', 'admin'].includes(actorRole)) {
      return err(new ForbiddenError('insufficient role to archive policies'));
    }
    const current = await this.repo.findById(organizationId, id);
    if (!current) return err(new NotFoundError('Policy not found'));
    if (current.status === 'archived') {
      return err(new ConflictError('Policy already archived'));
    }
    const updated = await this.repo.update(organizationId, id, {
      status: 'archived',
      updatedAt: new Date().toISOString(),
    });
    return ok(updated);
  }
}
