import { AppError } from '../../lib/errors.js';
import { ok, err, type Result } from '../../lib/result.js';
import type { SpaceRepository } from './repository.js';
import type { Space, CreateSpaceInput, UpdateSpaceInput } from './types.js';
import type { PaginationQuery, PaginatedResult } from '../../lib/pagination.js';
import type { BillingService } from '../billing/service.js';

export class SpaceService {
  constructor(
    private readonly repo: SpaceRepository,
    private readonly billing: BillingService,
  ) {}

  async create(
    organizationId: string,
    input: Omit<CreateSpaceInput, 'organizationId'>,
  ): Promise<Result<Space>> {
    const limitCheck = await this.billing.canAddSpace(organizationId);
    if (!limitCheck.ok) return limitCheck as Result<never>;
    const space = await this.repo.create({ ...input, organizationId });
    return ok(space);
  }

  async getById(organizationId: string, id: string): Promise<Result<Space>> {
    const space = await this.repo.findById(organizationId, id);
    if (!space) return err(AppError.notFound('Space', id));
    return ok(space);
  }

  async update(
    organizationId: string,
    id: string,
    input: UpdateSpaceInput,
  ): Promise<Result<Space>> {
    const updated = await this.repo.update(organizationId, id, input);
    if (!updated) return err(AppError.notFound('Space', id));
    return ok(updated);
  }

  async delete(organizationId: string, id: string): Promise<Result<void>> {
    const deleted = await this.repo.delete(organizationId, id);
    if (!deleted) return err(AppError.notFound('Space', id));
    return ok(undefined);
  }

  async list(organizationId: string, query: PaginationQuery): Promise<PaginatedResult<Space>> {
    return this.repo.list(organizationId, query);
  }
}
