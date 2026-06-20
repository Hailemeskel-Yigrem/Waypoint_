import type {
  Booking,
  CreateBookingInput,
  UpdateBookingInput,
  BookingConflictQuery,
} from './types.js';
import type { PaginatedResult, PaginationQuery } from '../../lib/pagination.js';

export interface BookingRepository {
  create(input: CreateBookingInput): Promise<Booking>;
  findById(organizationId: string, id: string): Promise<Booking | null>;
  update(organizationId: string, id: string, input: UpdateBookingInput): Promise<Booking | null>;
  delete(organizationId: string, id: string): Promise<boolean>;
  list(
    organizationId: string,
    query: PaginationQuery & { userId?: string; deskId?: string; spaceId?: string },
  ): Promise<PaginatedResult<Booking>>;
  findConflicts(query: BookingConflictQuery): Promise<Booking[]>;
  countThisMonth(organizationId: string): Promise<number>;
}
