export const APP_NAME = 'Waypoint';

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

export const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const VISITOR_STATUSES = ['expected', 'checked_in', 'checked_out', 'expired'] as const;
export type VisitorStatus = (typeof VISITOR_STATUSES)[number];

export const SPACE_TYPES = ['desk', 'meeting_room', 'phone_booth', 'open_area'] as const;
export type SpaceType = (typeof SPACE_TYPES)[number];

export const USER_ROLES = ['owner', 'admin', 'manager', 'member', 'guest'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const INVOICE_STATUSES = ['draft', 'sent', 'paid', 'overdue', 'void'] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const AMENITY_TYPES = ['parking', 'locker', 'gym', 'cafe', 'shower', 'bike_storage'] as const;
export type AmenityType = (typeof AMENITY_TYPES)[number];

export const WEBHOOK_EVENTS = [
  'booking.created',
  'booking.cancelled',
  'visitor.registered',
  'visitor.checked_in',
  'invoice.generated',
] as const;

export const TIMEZONE_DEFAULT = 'UTC';
export const CURRENCY_DEFAULT = 'USD';
export const LOCALE_DEFAULT = 'en-US';
