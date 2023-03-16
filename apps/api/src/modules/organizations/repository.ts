import type { Organization, CreateOrganizationInput, UpdateOrganizationInput } from './types.js';
import type { PaginatedResult, PaginationQuery } from '../../lib/pagination.js';

export interface OrganizationRepository {
  create(input: CreateOrganizationInput): Promise<Organization>;
  findById(id: string): Promise<Organization | null>;
  findBySlug(slug: string): Promise<Organization | null>;
  update(id: string, input: UpdateOrganizationInput): Promise<Organization | null>;
  delete(id: string): Promise<boolean>;
  list(query: PaginationQuery): Promise<PaginatedResult<Organization>>;
  countByPlan(plan: Organization['plan']): Promise<number>;
}
