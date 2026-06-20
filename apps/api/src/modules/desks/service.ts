import { AppError } from '../../lib/errors.js';
import { ok, err, type Result } from '../../lib/result.js';
import type { DeskRepository } from './repository.js';
import type { Desk, CreateDeskInput, UpdateDeskInput } from './types.js';
import type { PaginationQuery, PaginatedResult } from '../../lib/pagination.js';
import type { BillingService } from '../billing/service.js';
import type { SpaceRepository } from '../spaces/repository.js';

export class DeskService {
  constructor(
    private readonly repo: DeskRepository,
    private readonly spaceRepo: SpaceRepository,
    private readonly billing: BillingService,
  ) {}

  async create(
    organizationId: string,
    input: Omit<CreateDeskInput, 'organizationId'>,
  ): Promise<Result<Desk>> {
    const space = await this.spaceRepo.findById(organizationId, input.spaceId);
    if (!space) return err(AppError.notFound('Space', input.spaceId));

    const limitCheck = await this.billing.canAddDesk(organizationId);
    if (!limitCheck.ok) return limitCheck as Result<never>;

    const desk = await this.repo.create({ ...input, organizationId });
    return ok(desk);
  }

  async getById(organizationId: string, id: string): Promise<Result<Desk>> {
    const desk = await this.repo.findById(organizationId, id);
    if (!desk) return err(AppError.notFound('Desk', id));
    return ok(desk);
  }

  async update(organizationId: string, id: string, input: UpdateDeskInput): Promise<Result<Desk>> {
    const updated = await this.repo.update(organizationId, id, input);
    if (!updated) return err(AppError.notFound('Desk', id));
    return ok(updated);
  }

  async delete(organizationId: string, id: string): Promise<Result<void>> {
    const deleted = await this.repo.delete(organizationId, id);
    if (!deleted) return err(AppError.notFound('Desk', id));
    return ok(undefined);
  }

  async list(
    organizationId: string,
    query: PaginationQuery & { spaceId?: string },
  ): Promise<PaginatedResult<Desk>> {
    return this.repo.list(organizationId, query);
  }
}
