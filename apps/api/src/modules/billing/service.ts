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

