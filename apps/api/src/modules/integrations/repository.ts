import type { Integration, CreateIntegrationInput, UpdateIntegrationInput } from './types.js';
import type { PaginatedResult, PaginationQuery } from '../../lib/pagination.js';

export interface IntegrationRepository {
  create(input: CreateIntegrationInput): Promise<Integration>;
  findById(organizationId: string, id: string): Promise<Integration | null>;
  update(
    organizationId: string,
    id: string,
    input: UpdateIntegrationInput,
  ): Promise<Integration | null>;
  delete(organizationId: string, id: string): Promise<boolean>;
  list(organizationId: string, query: PaginationQuery): Promise<PaginatedResult<Integration>>;
}
