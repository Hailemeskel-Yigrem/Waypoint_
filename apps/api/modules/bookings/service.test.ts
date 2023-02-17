import { describe, it, expect, beforeEach } from 'vitest';
import { BookingService } from '../../src/modules/bookings/service.js';
import { MemoryBookingRepository } from '../../src/modules/bookings/memory.repository.js';
import { MemoryDeskRepository } from '../../src/modules/desks/memory.repository.js';
import { MemorySpaceRepository } from '../../src/modules/spaces/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemoryBillingRepository } from '../../src/modules/billing/memory.repository.js';
import { MemoryAccessPolicyRepository } from '../../src/modules/access/memory.repository.js';
import { BillingService } from '../../src/modules/billing/service.js';
import { AccessService } from '../../src/modules/access/service.js';

describe('BookingService overlap rules', () => {
  let service: BookingService;
  let orgId: string;
  let userId: string;
  let deskId: string;

  beforeEach(async () => {
    const orgRepo = new MemoryOrganizationRepository();
    orgId = (await orgRepo.create({ name: 'O', slug: 'book' })).id;
    const userRepo = new MemoryUserRepository();
    userId = (await userRepo.create({ organizationId: orgId, email: 'u@t.com', name: 'U' })).id;
    const spaceRepo = new MemorySpaceRepository();
    const spaceId = (await spaceRepo.create({ organizationId: orgId, name: 'S', type: 'office' })).id;
    const deskRepo = new MemoryDeskRepository();
    deskId = (await deskRepo.create({ organizationId: orgId, spaceId, label: 'D1' })).id;
    const bookingRepo = new MemoryBookingRepository();
    const billing = new BillingService(new MemoryBillingRepository(), orgRepo, userRepo, spaceRepo, deskRepo, bookingRepo);
    const access = new AccessService(new MemoryAccessPolicyRepository(), userRepo);
    service = new BookingService(bookingRepo, deskRepo, spaceRepo, billing, access);
  });

  it('creates non-overlapping bookings', async () => {
    const start = new Date('2026-02-01T09:00:00Z');
    const end = new Date('2026-02-01T11:00:00Z');
    const r1 = await service.create(orgId, userId, { deskId, title: 'Morning', startTime: start, endTime: end });
    expect(r1.ok).toBe(true);
    const r2 = await service.create(orgId, userId, {
      deskId, title: 'Afternoon',
      startTime: new Date('2026-02-01T12:00:00Z'),
      endTime: new Date('2026-02-01T14:00:00Z'),
    });
    expect(r2.ok).toBe(true);
  });

  it('rejects overlapping desk bookings', async () => {
    const start = new Date('2026-03-01T09:00:00Z');
    const end = new Date('2026-03-01T12:00:00Z');
    await service.create(orgId, userId, { deskId, title: 'First', startTime: start, endTime: end });
    const overlap = await service.create(orgId, userId, {
      deskId, title: 'Overlap',
      startTime: new Date('2026-03-01T11:00:00Z'),
      endTime: new Date('2026-03-01T13:00:00Z'),
    });
    expect(overlap.ok).toBe(false);
    if (!overlap.ok) expect(overlap.error.code).toBe('BOOKING_OVERLAP');
  });
});

