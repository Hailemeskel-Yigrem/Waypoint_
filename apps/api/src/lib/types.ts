export interface TenantScoped {
  organizationId: string;
}

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeletable {
  deletedAt: Date | null;
}

export type UserRole = 'owner' | 'admin' | 'manager' | 'member' | 'viewer';

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';

export type VisitorStatus = 'expected' | 'checked_in' | 'checked_out' | 'denied' | 'no_show';

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';

export type BillingPlan = 'free' | 'starter' | 'professional' | 'enterprise';

export const BILLING_LIMITS: Record<
  BillingPlan,
  { maxSeats: number; maxSpaces: number; maxDesks: number; maxBookingsPerMonth: number }
> = {
  free: { maxSeats: 5, maxSpaces: 2, maxDesks: 10, maxBookingsPerMonth: 100 },
  starter: { maxSeats: 25, maxSpaces: 10, maxDesks: 50, maxBookingsPerMonth: 1000 },
  professional: { maxSeats: 100, maxSpaces: 50, maxDesks: 250, maxBookingsPerMonth: 10000 },
  enterprise: { maxSeats: 10000, maxSpaces: 1000, maxDesks: 50000, maxBookingsPerMonth: 1000000 },
};

export interface AuthContext {
  userId: string;
  organizationId: string;
  role: UserRole;
  email: string;
}

export interface RequestContext extends AuthContext {
  requestId: string;
}

export function assertSameTenant(resourceOrgId: string, ctxOrgId: string): void {
  if (resourceOrgId !== ctxOrgId) {
    throw new Error('TENANT_MISMATCH');
  }
}

export function overlaps(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
  return startA < endB && startB < endA;
}

export function isWithinWindow(time: Date, windowStart: Date, windowEnd: Date): boolean {
  return time >= windowStart && time <= windowEnd;
}
