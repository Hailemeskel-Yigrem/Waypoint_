import { ok, err, type Result } from '../result.js';
import { ValidationError, ConflictError, NotFoundError, ForbiddenError } from '../errors.js';
import type { Asset, CreateAssetInput, UpdateAssetInput, AssetFilter } from './types.js';
import type { AssetRepository } from './repository.js';

export class AssetService {
  constructor(private readonly repo: AssetRepository) {}

  // Rule: Assets track equipment
  // Rule: Maintenance windows block booking

  async create(input: CreateAssetInput): Promise<Result<Asset, Error>> {
    if (!input.organizationId?.trim()) {
      return err(new ValidationError('organizationId is required'));
    }
    if (!input.name?.trim()) {
      return err(new ValidationError('name is required'));
    }
    const existing = await this.repo.findByName(input.organizationId, input.name);
    if (existing) {
      return err(new ConflictError(`assets already exists: ${input.name}`));
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

  async get(organizationId: string, id: string): Promise<Result<Asset, Error>> {
    const row = await this.repo.findById(organizationId, id);
    if (!row) return err(new NotFoundError('Asset not found'));
    return ok(row);
  }

  async list(filter: AssetFilter): Promise<Result<Asset[], Error>> {
    if (!filter.organizationId) {
      return err(new ValidationError('organizationId is required'));
    }
    const rows = await this.repo.list(filter);
    return ok(rows);
  }

  async update(
    organizationId: string,
    id: string,
    input: UpdateAssetInput,
    actorRole: string,
  ): Promise<Result<Asset, Error>> {
    if (!['owner', 'admin', 'manager'].includes(actorRole)) {
      return err(new ForbiddenError('insufficient role to update assets'));
    }
    const current = await this.repo.findById(organizationId, id);
    if (!current) return err(new NotFoundError('Asset not found'));
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
  ): Promise<Result<Asset, Error>> {
    if (!['owner', 'admin'].includes(actorRole)) {
      return err(new ForbiddenError('insufficient role to archive assets'));
    }
    const current = await this.repo.findById(organizationId, id);
    if (!current) return err(new NotFoundError('Asset not found'));
    if (current.status === 'archived') {
      return err(new ConflictError('Asset already archived'));
    }
    const updated = await this.repo.update(organizationId, id, {
      status: 'archived',
      updatedAt: new Date().toISOString(),
    });
    return ok(updated);
  }
}
