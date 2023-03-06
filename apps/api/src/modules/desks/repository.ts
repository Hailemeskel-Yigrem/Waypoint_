import type { Desk, CreateDeskInput, UpdateDeskInput } from './types.js';
import type { PaginatedResult, PaginationQuery } from '../../lib/pagination.js';

export interface DeskRepository {
  create(input: CreateDeskInput): Promise<Desk>;
  findById(organizationId: string, id: string): Promise<Desk | null>;
  findBySpace(organizationId: string, spaceId: string): Promise<Desk[]>;
  update(organizationId: string, id: string, input: UpdateDeskInput): Promise<Desk | null>;
  delete(organizationId: string, id: string): Promise<boolean>;
  list(organizationId: string, query: PaginationQuery & { spaceId?: string }): Promise<PaginatedResult<Desk>>;
  count(organizationId: string): Promise<number>;
}
