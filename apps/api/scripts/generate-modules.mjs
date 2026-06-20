#!/usr/bin/env node
// Generator for remaining Waypoint API modules
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modulesDir = path.join(__dirname, '..', 'src', 'modules');

function write(rel, content) {
  const full = path.join(modulesDir, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart() + '\n');
}

// Billing module
write('billing/types.ts', `
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
`);

write('billing/schema.ts', `
import { z } from 'zod';

export const updateSubscriptionSchema = z.object({
  plan: z.enum(['free', 'starter', 'professional', 'enterprise']).optional(),
  seatCount: z.number().int().min(1).optional(),
});

export type UpdateSubscriptionDto = z.infer<typeof updateSubscriptionSchema>;
`);

write('billing/repository.ts', `
import type { Subscription } from './types.js';
import type { BillingPlan } from '../../lib/types.js';

export interface BillingRepository {
  getSubscription(organizationId: string): Promise<Subscription | null>;
  upsertSubscription(organizationId: string, plan: BillingPlan, seatCount: number): Promise<Subscription>;
  updatePlan(organizationId: string, plan: BillingPlan): Promise<Subscription | null>;
}
`);

write('billing/memory.repository.ts', `
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
`);

write('billing/service.ts', `
import { AppError } from '../../lib/errors.js';
import { BILLING_LIMITS } from '../../lib/types.js';
import { ok, err, type Result } from '../../lib/result.js';
import type { BillingRepository } from './repository.js';
import type { Subscription, UsageSnapshot } from './types.js';
import type { OrganizationRepository } from '../organizations/repository.js';
import type { UserRepository } from '../users/repository.js';
import type { SpaceRepository } from '../spaces/repository.js';
import type { DeskRepository } from '../desks/repository.js';
import type { BookingRepository } from '../bookings/repository.js';
import type { BillingPlan } from '../../lib/types.js';

export class BillingService {
  constructor(
    private readonly repo: BillingRepository,
    private readonly orgRepo: OrganizationRepository,
    private readonly userRepo: UserRepository,
    private readonly spaceRepo: SpaceRepository,
    private readonly deskRepo: DeskRepository,
    private readonly bookingRepo: BookingRepository,
  ) {}

  async getSubscription(organizationId: string): Promise<Result<Subscription>> {
    let sub = await this.repo.getSubscription(organizationId);
    if (!sub) {
      const org = await this.orgRepo.findById(organizationId);
      if (!org) return err(AppError.notFound('Organization', organizationId));
      sub = await this.repo.upsertSubscription(organizationId, org.plan, BILLING_LIMITS[org.plan].maxSeats);
    }
    return ok(sub);
  }

  async getUsage(organizationId: string): Promise<UsageSnapshot> {
    const [activeSeats, spaceCount, deskCount, bookingsThisMonth] = await Promise.all([
      this.userRepo.countActive(organizationId),
      this.spaceRepo.count(organizationId),
      this.deskRepo.count(organizationId),
      this.bookingRepo.countThisMonth(organizationId),
    ]);
    return { organizationId, activeSeats, spaceCount, deskCount, bookingsThisMonth };
  }

  async canAddSeat(organizationId: string): Promise<Result<void>> {
    const sub = await this.getSubscription(organizationId);
    if (!sub.ok) return sub as Result<never>;
    const usage = await this.getUsage(organizationId);
    const limits = BILLING_LIMITS[sub.value.plan];
    if (usage.activeSeats >= limits.maxSeats) {
      return err(AppError.billingLimit('Seat limit reached for current plan', { limit: limits.maxSeats }));
    }
    return ok(undefined);
  }

  async canAddSpace(organizationId: string): Promise<Result<void>> {
    const sub = await this.getSubscription(organizationId);
    if (!sub.ok) return sub as Result<never>;
    const count = await this.spaceRepo.count(organizationId);
    const limits = BILLING_LIMITS[sub.value.plan];
    if (count >= limits.maxSpaces) {
      return err(AppError.billingLimit('Space limit reached for current plan', { limit: limits.maxSpaces }));
    }
    return ok(undefined);
  }

  async canAddDesk(organizationId: string): Promise<Result<void>> {
    const sub = await this.getSubscription(organizationId);
    if (!sub.ok) return sub as Result<never>;
    const count = await this.deskRepo.count(organizationId);
    const limits = BILLING_LIMITS[sub.value.plan];
    if (count >= limits.maxDesks) {
      return err(AppError.billingLimit('Desk limit reached for current plan', { limit: limits.maxDesks }));
    }
    return ok(undefined);
  }

  async canCreateBooking(organizationId: string): Promise<Result<void>> {
    const sub = await this.getSubscription(organizationId);
    if (!sub.ok) return sub as Result<never>;
    const count = await this.bookingRepo.countThisMonth(organizationId);
    const limits = BILLING_LIMITS[sub.value.plan];
    if (count >= limits.maxBookingsPerMonth) {
      return err(AppError.billingLimit('Monthly booking limit reached', { limit: limits.maxBookingsPerMonth }));
    }
    return ok(undefined);
  }

  async updatePlan(organizationId: string, plan: BillingPlan): Promise<Result<Subscription>> {
    const updated = await this.repo.updatePlan(organizationId, plan);
    if (!updated) return err(AppError.notFound('Subscription'));
    await this.orgRepo.update(organizationId, { plan });
    return ok(updated);
  }
}
`);

write('billing/routes.ts', `
import type { FastifyInstance } from 'fastify';
import { updateSubscriptionSchema } from './schema.js';
import { throwIfError } from '../../middleware/errorHandler.js';
import { requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';

export function registerBillingRoutes(app: FastifyInstance): void {
  const service = app.services.billing;

  app.register(async (scoped) => {
    scoped.addHook('preHandler', app.authHook);
    scoped.addHook('preHandler', tenantMiddleware);

    scoped.get('/billing/subscription', async (request, reply) => {
      reply.send({ data: throwIfError(await service.getSubscription(request.tenantId)) });
    });

    scoped.get('/billing/usage', async (request, reply) => {
      reply.send({ data: await service.getUsage(request.tenantId) });
    });

    scoped.patch('/billing/subscription', { preHandler: requireRole('owner') }, async (request, reply) => {
      const body = updateSubscriptionSchema.parse(request.body);
      if (!body.plan) throw new Error('plan required');
      reply.send({ data: throwIfError(await service.updatePlan(request.tenantId, body.plan)) });
    });
  });
}
`);

write('billing/index.ts', `
export * from './types.js';
export * from './schema.js';
export * from './repository.js';
export * from './memory.repository.js';
export * from './service.js';
export * from './routes.js';
`);

console.log('Generated billing module');
