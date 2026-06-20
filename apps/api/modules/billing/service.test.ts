import { describe, it, expect, beforeEach } from 'vitest';
import { BillingService } from '../../src/modules/billing/service.js';
import { MemoryBillingRepository } from '../../src/modules/billing/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemorySpaceRepository } from '../../src/modules/spaces/memory.repository.js';
import { MemoryDeskRepository } from '../../src/modules/desks/memory.repository.js';
import { MemoryBookingRepository } from '../../src/modules/bookings/memory.repository.js';
import { BILLING_LIMITS } from '../../src/lib/types.js';

describe('BillingService plan limits', () => {
  let service: BillingService;
  let orgId: string;
  let userRepo: MemoryUserRepository;

  beforeEach(async () => {
    const orgRepo = new MemoryOrganizationRepository();
    orgId = (await orgRepo.create({ name: 'O', slug: 'bill', plan: 'free' })).id;
    userRepo = new MemoryUserRepository();
    service = new BillingService(
      new MemoryBillingRepository(),
      orgRepo,
      userRepo,
      new MemorySpaceRepository(),
      new MemoryDeskRepository(),
      new MemoryBookingRepository(),
    );
  });

  it('blocks seats beyond free plan limit', async () => {
    for (let i = 0; i < BILLING_LIMITS.free.maxSeats; i++) {
      const u = await userRepo.create({
        organizationId: orgId,
        email: `u${i}@t.com`,
        name: `U${i}`,
      });
      await userRepo.update(orgId, u.id, { status: 'active' });
    }
    const result = await service.canAddSeat(orgId);
    expect(result.ok).toBe(false);
  });
});
