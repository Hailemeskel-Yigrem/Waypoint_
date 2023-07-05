import { ok, err, type Result } from '../result.js';
import { ValidationError, ConflictError, NotFoundError, ForbiddenError } from '../errors.js';
import type {
  AuditEvent,
  CreateAuditEventInput,
  UpdateAuditEventInput,
  AuditEventFilter,
} from './types.js';
import type { AuditEventRepository } from './repository.js';

export class AuditEventService {
  constructor(private readonly repo: AuditEventRepository) {}

  // Rule: Audit events immutable
  // Rule: Tenant isolation enforced

  async create(input: CreateAuditEventInput): Promise<Result<AuditEvent, Error>> {
    if (!input.organizationId?.trim()) {
      return err(new ValidationError('organizationId is required'));
    }
    if (!input.name?.trim()) {
      return err(new ValidationError('name is required'));
    }
    const existing = await this.repo.findByName(input.organizationId, input.name);
    if (existing) {
      return err(new ConflictError(`audit already exists: ${input.name}`));
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

  async get(organizationId: string, id: string): Promise<Result<AuditEvent, Error>> {
    const row = await this.repo.findById(organizationId, id);
    if (!row) return err(new NotFoundError('AuditEvent not found'));
    return ok(row);
  }

  async list(filter: AuditEventFilter): Promise<Result<AuditEvent[], Error>> {
    if (!filter.organizationId) {
      return err(new ValidationError('organizationId is required'));
    }
    const rows = await this.repo.list(filter);
    return ok(rows);
  }

  async update(
    organizationId: string,
    id: string,
    input: UpdateAuditEventInput,
    actorRole: string,
  ): Promise<Result<AuditEvent, Error>> {
    if (!['owner', 'admin', 'manager'].includes(actorRole)) {
      return err(new ForbiddenError('insufficient role to update audit'));
    }
    const current = await this.repo.findById(organizationId, id);
    if (!current) return err(new NotFoundError('AuditEvent not found'));
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
  ): Promise<Result<AuditEvent, Error>> {
    if (!['owner', 'admin'].includes(actorRole)) {
      return err(new ForbiddenError('insufficient role to archive audit'));
    }
    const current = await this.repo.findById(organizationId, id);
    if (!current) return err(new NotFoundError('AuditEvent not found'));
    if (current.status === 'archived') {
      return err(new ConflictError('AuditEvent already archived'));
    }
    const updated = await this.repo.update(organizationId, id, {
      status: 'archived',
      updatedAt: new Date().toISOString(),
    });
    return ok(updated);
  }
}
