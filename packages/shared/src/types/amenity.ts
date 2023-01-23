import type { AmenityType } from '../constants/index.js';
import type { EntityId, OrgId } from './id.js';

export interface Amenity {
  id: EntityId;
  orgId: OrgId;
  name: string;
  type: AmenityType;
  capacity: number;
  isActive: boolean;
}

export interface AmenityBooking {
  id: EntityId;
  amenityId: EntityId;
  userId: EntityId;
  startAt: string;
  endAt: string;
}
