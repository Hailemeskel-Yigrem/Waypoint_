import type { Subscription } from './types.js';
import type { BillingPlan } from '../../lib/types.js';

export interface BillingRepository {
  getSubscription(organizationId: string): Promise<Subscription | null>;
  upsertSubscription(organizationId: string, plan: BillingPlan, seatCount: number): Promise<Subscription>;
  updatePlan(organizationId: string, plan: BillingPlan): Promise<Subscription | null>;
}

