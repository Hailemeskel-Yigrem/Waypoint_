import { ok, err, type Result } from '../result.js';
import { ValidationError, ConflictError, NotFoundError, ForbiddenError } from '../errors.js';
import type {
  FeatureFlag,
  CreateFeatureFlagInput,
  UpdateFeatureFlagInput,
  FeatureFlagFilter,
} from './types.js';
import type { FeatureFlagRepository } from './repository.js';

export class FeatureFlagService {
  constructor(private readonly repo: FeatureFlagRepository) {}

  // Rule: Flags scoped org or global
  // Rule: Percentage rollout 0-100

  async create(input: CreateFeatureFlagInput): Promise<Result<FeatureFlag, Error>> {
    if (!input.organizationId?.trim()) {
      return err(new ValidationError('organizationId is required'));
    }
    if (!input.name?.trim()) {
      return err(new ValidationError('name is required'));
    }
    const existing = await this.repo.findByName(input.organizationId, input.name);
    if (existing) {
      return err(new ConflictError(`featureFlags already exists: ${input.name}`));
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

  async get(organizationId: string, id: string): Promise<Result<FeatureFlag, Error>> {
    const row = await this.repo.findById(organizationId, id);
    if (!row) return err(new NotFoundError('FeatureFlag not found'));
    return ok(row);
  }

  async list(filter: FeatureFlagFilter): Promise<Result<FeatureFlag[], Error>> {
    if (!filter.organizationId) {
      return err(new ValidationError('organizationId is required'));
    }
    const rows = await this.repo.list(filter);
    return ok(rows);
  }

  async update(
    organizationId: string,
    id: string,
    input: UpdateFeatureFlagInput,
    actorRole: string,
  ): Promise<Result<FeatureFlag, Error>> {
    if (!['owner', 'admin', 'manager'].includes(actorRole)) {
      return err(new ForbiddenError('insufficient role to update featureFlags'));
    }
    const current = await this.repo.findById(organizationId, id);
    if (!current) return err(new NotFoundError('FeatureFlag not found'));
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
  ): Promise<Result<FeatureFlag, Error>> {
    if (!['owner', 'admin'].includes(actorRole)) {
      return err(new ForbiddenError('insufficient role to archive featureFlags'));
    }
    const current = await this.repo.findById(organizationId, id);
    if (!current) return err(new NotFoundError('FeatureFlag not found'));
    if (current.status === 'archived') {
      return err(new ConflictError('FeatureFlag already archived'));
    }
    const updated = await this.repo.update(organizationId, id, {
      status: 'archived',
      updatedAt: new Date().toISOString(),
    });
    return ok(updated);
  }
}
