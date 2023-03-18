import type { Space, CreateSpaceInput, UpdateSpaceInput } from './types.js';
import type { PaginatedResult, PaginationQuery } from '../../lib/pagination.js';

export interface SpaceRepository {
  create(input: CreateSpaceInput): Promise<Space>;
  findById(organizationId: string, id: string): Promise<Space | null>;
  update(organizationId: string, id: string, input: UpdateSpaceInput): Promise<Space | null>;
  delete(organizationId: string, id: string): Promise<boolean>;
  list(organizationId: string, query: PaginationQuery): Promise<PaginatedResult<Space>>;
  count(organizationId: string): Promise<number>;
}
