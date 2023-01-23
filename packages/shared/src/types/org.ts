import type { EntityId } from './id.js';

export interface Organization {
  id: EntityId;
  name: string;
  slug: string;
  timezone: string;
  locale: string;
  currency: string;
  logoUrl?: string;
  settings: OrgSettings;
  createdAt: string;
  updatedAt: string;
}

export interface OrgSettings {
  allowGuestBookings: boolean;
  visitorExpiryHours: number;
  bookingReminderMinutes: number;
  requireVisitorApproval: boolean;
}
