import type { Visitor, CreateVisitorInput, UpdateVisitorInput } from './types.js';
import type { PaginatedResult, PaginationQuery } from '../../lib/pagination.js';

export interface VisitorRepository {
  create(
    input: CreateVisitorInput & { checkInWindowStart: Date; checkInWindowEnd: Date },
  ): Promise<Visitor>;
  findById(organizationId: string, id: string): Promise<Visitor | null>;
  update(organizationId: string, id: string, input: UpdateVisitorInput): Promise<Visitor | null>;
  list(
    organizationId: string,
    query: PaginationQuery & { hostUserId?: string; status?: string },
  ): Promise<PaginatedResult<Visitor>>;
}
