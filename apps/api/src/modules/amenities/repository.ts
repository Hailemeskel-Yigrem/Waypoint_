import type { Amenity, AmenityReservation, CreateAmenityInput, CreateReservationInput } from './types.js';
import type { PaginatedResult, PaginationQuery } from '../../lib/pagination.js';

export interface AmenityRepository {
  create(input: CreateAmenityInput): Promise<Amenity>;
  findById(organizationId: string, id: string): Promise<Amenity | null>;
  list(organizationId: string, query: PaginationQuery): Promise<PaginatedResult<Amenity>>;
  createReservation(input: CreateReservationInput): Promise<AmenityReservation>;
  findReservations(organizationId: string, amenityId: string, startTime: Date, endTime: Date): Promise<AmenityReservation[]>;
  countOccupancy(organizationId: string, amenityId: string, startTime: Date, endTime: Date): Promise<number>;
}
