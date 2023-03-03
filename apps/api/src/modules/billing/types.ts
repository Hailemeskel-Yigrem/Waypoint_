import type { Timestamps, BillingPlan } from '../../lib/types.js';

export interface Subscription extends Timestamps {
  id: string;
  organizationId: string;
  plan: BillingPlan;
  seatCount: number;
  status: 'active' | 'past_due' | 'cancelled';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}

export interface UsageSnapshot {
  organizationId: string;
  activeSeats: number;
  spaceCount: number;
  deskCount: number;
  bookingsThisMonth: number;
}

