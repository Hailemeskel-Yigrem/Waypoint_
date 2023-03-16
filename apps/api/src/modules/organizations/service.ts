import { AppError } from '../../lib/errors.js';
import { ok, err, type Result } from '../../lib/result.js';
import type { OrganizationRepository } from './repository.js';
import type { Organization, CreateOrganizationInput, UpdateOrganizationInput } from './types.js';
import type { PaginationQuery } from '../../lib/pagination.js';
import type { PaginatedResult } from '../../lib/pagination.js';

export class OrganizationService {
  constructor(private readonly repo: OrganizationRepository) {}

  async create(input: CreateOrganizationInput): Promise<Result<Organization>> {
    const existing = await this.repo.findBySlug(input.slug);
    if (existing) {
      return err(AppError.conflict(`Organization slug '${input.slug}' is already taken`));
    }
    const org = await this.repo.create(input);
    return ok(org);
  }

  async getById(id: string): Promise<Result<Organization>> {
    const org = await this.repo.findById(id);
    if (!org) return err(AppError.notFound('Organization', id));
    return ok(org);
  }

  async getBySlug(slug: string): Promise<Result<Organization>> {
    const org = await this.repo.findBySlug(slug);
    if (!org) return err(AppError.notFound('Organization'));
    return ok(org);
  }

  async update(id: string, input: UpdateOrganizationInput): Promise<Result<Organization>> {
    if (input.slug) {
      const existing = await this.repo.findBySlug(input.slug);
      if (existing && existing.id !== id) {
        return err(AppError.conflict(`Organization slug '${input.slug}' is already taken`));
      }
    }
    const updated = await this.repo.update(id, input);
    if (!updated) return err(AppError.notFound('Organization', id));
    return ok(updated);
  }

  async delete(id: string): Promise<Result<void>> {
    const deleted = await this.repo.delete(id);
    if (!deleted) return err(AppError.notFound('Organization', id));
    return ok(undefined);
  }

  async list(query: PaginationQuery): Promise<PaginatedResult<Organization>> {
    return this.repo.list(query);
  }
}
