import type { Timestamps, TenantScoped } from '../../lib/types.js';

export type AmenityType = 'gym' | 'parking' | 'cafeteria' | 'locker' | 'shower' | 'other';

export interface Amenity extends Timestamps, TenantScoped {
  id: string;
  spaceId: string;
  name: string;
  type: AmenityType;
  capacity: number;
  isActive: boolean;
}

export interface AmenityReservation extends Timestamps, TenantScoped {
  id: string;
  amenityId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  partySize: number;
}

export interface CreateAmenityInput {
  organizationId: string;
  spaceId: string;
  name: string;
  type: AmenityType;
  capacity: number;
}

export interface CreateReservationInput {
  organizationId: string;
  amenityId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  partySize: number;
}
