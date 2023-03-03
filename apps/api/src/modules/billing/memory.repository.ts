import { generateId } from '../../lib/id.js';
import type { BillingRepository } from './repository.js';
import type { Subscription } from './types.js';
import type { BillingPlan } from '../../lib/types.js';

export class MemoryBillingRepository implements BillingRepository {
  private readonly store = new Map<string, Subscription>();

  async getSubscription(organizationId: string): Promise<Subscription | null> {
    return this.store.get(organizationId) ?? null;
  }

  async upsertSubscription(organizationId: string, plan: BillingPlan, seatCount: number): Promise<Subscription> {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    const existing = this.store.get(organizationId);
    const sub: Subscription = {
      id: existing?.id ?? generateId('organization'),
      organizationId,
      plan,
      seatCount,
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    this.store.set(organizationId, sub);
    return sub;
  }

  async updatePlan(organizationId: string, plan: BillingPlan): Promise<Subscription | null> {
    const existing = this.store.get(organizationId);
    if (!existing) return null;
    const updated = { ...existing, plan, updatedAt: new Date() };
    this.store.set(organizationId, updated);
    return updated;
  }

  clear(): void { this.store.clear(); }
}

