import type { Timestamps, TenantScoped, BookingStatus } from '../../lib/types.js';

export interface Booking extends Timestamps, TenantScoped {
  id: string;
  userId: string;
  spaceId: string | null;
  deskId: string | null;
  title: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  notes: string | null;
}

export interface CreateBookingInput {
  organizationId: string;
  userId: string;
  spaceId?: string | null;
  deskId?: string | null;
  title: string;
  startTime: Date;
  endTime: Date;
  notes?: string | null;
}

export interface UpdateBookingInput {
  title?: string;
  startTime?: Date;
  endTime?: Date;
  status?: BookingStatus;
  notes?: string | null;
}

export interface BookingConflictQuery {
  organizationId: string;
  deskId?: string | null;
  spaceId?: string | null;
  startTime: Date;
  endTime: Date;
  excludeId?: string;
}
