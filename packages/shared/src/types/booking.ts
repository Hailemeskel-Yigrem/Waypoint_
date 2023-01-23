import type { BookingStatus } from '../constants/index.js';
import type { BookingId, EntityId, OrgId, UserId } from './id.js';

export interface Booking {
  id: BookingId;
  orgId: OrgId;
  userId: UserId;
  resourceType: 'desk' | 'space';
  resourceId: EntityId;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
