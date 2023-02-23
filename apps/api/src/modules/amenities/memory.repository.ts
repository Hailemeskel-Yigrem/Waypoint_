import { generateId } from '../../lib/id.js';
import { paginate, offsetFromPage, sortItems } from '../../lib/pagination.js';
import { overlaps } from '../../lib/types.js';
import type { AmenityRepository } from './repository.js';
import type { Amenity, AmenityReservation, CreateAmenityInput, CreateReservationInput } from './types.js';

export class MemoryAmenityRepository implements AmenityRepository {
  private readonly amenities = new Map<string, Amenity>();
  private readonly reservations = new Map<string, AmenityReservation>();

  private aKey(orgId: string, id: string): string {
    return `${orgId}:${id}`;
  }

  async create(input: CreateAmenityInput): Promise<Amenity> {
    const now = new Date();
    const amenity: Amenity = {
      id: generateId('amenity'),
      organizationId: input.organizationId,
      spaceId: input.spaceId,
      name: input.name,
      type: input.type,
      capacity: input.capacity,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.amenities.set(this.aKey(amenity.organizationId, amenity.id), amenity);
    return amenity;
  }

  async findById(organizationId: string, id: string): Promise<Amenity | null> {
    const a = this.amenities.get(this.aKey(organizationId, id));
    return a?.organizationId === organizationId ? a : null;
  }

  async list(organizationId: string, query) {
    const all = [...this.amenities.values()].filter((a) => a.organizationId === organizationId);
    const sorted = sortItems(all, query.sortBy as keyof Amenity, query.sortOrder);
    const offset = offsetFromPage(query.page, query.limit);
    return paginate(sorted.slice(offset, offset + query.limit), query.page, query.limit, all.length);
  }

  async createReservation(input: CreateReservationInput): Promise<AmenityReservation> {
    const now = new Date();
    const reservation: AmenityReservation = {
      id: generateId('booking'),
      organizationId: input.organizationId,
      amenityId: input.amenityId,
      userId: input.userId,
      startTime: input.startTime,
      endTime: input.endTime,
      partySize: input.partySize,
      createdAt: now,
      updatedAt: now,
    };
    this.reservations.set(this.aKey(reservation.organizationId, reservation.id), reservation);
    return reservation;
  }

  async findReservations(organizationId: string, amenityId: string, startTime: Date, endTime: Date): Promise<AmenityReservation[]> {
    return [...this.reservations.values()].filter(
      (r) =>
        r.organizationId === organizationId &&
        r.amenityId === amenityId &&
        overlaps(startTime, endTime, r.startTime, r.endTime),
    );
  }

  async countOccupancy(organizationId: string, amenityId: string, startTime: Date, endTime: Date): Promise<number> {
    const reservations = await this.findReservations(organizationId, amenityId, startTime, endTime);
    return reservations.reduce((sum, r) => sum + r.partySize, 0);
  }

  clear(): void {
    this.amenities.clear();
    this.reservations.clear();
  }
}
