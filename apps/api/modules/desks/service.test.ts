import { describe, it, expect, beforeEach } from 'vitest';
import { DeskService } from '../../src/modules/desks/service.js';
import { MemoryDeskRepository } from '../../src/modules/desks/memory.repository.js';
import { MemorySpaceRepository } from '../../src/modules/spaces/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemoryBookingRepository } from '../../src/modules/bookings/memory.repository.js';
import { MemoryBillingRepository } from '../../src/modules/billing/memory.repository.js';
import { BillingService } from '../../src/modules/billing/service.js';

describe('DeskService', () => {
  let service: DeskService;
  let orgId: string;
  let spaceId: string;

  beforeEach(async () => {
    const orgRepo = new MemoryOrganizationRepository();
    orgId = (await orgRepo.create({ name: 'O', slug: 'o2' })).id;
    const spaceRepo = new MemorySpaceRepository();
    spaceId = (await spaceRepo.create({ organizationId: orgId, name: 'S', type: 'office' })).id;
    const billing = new BillingService(new MemoryBillingRepository(), orgRepo, new MemoryUserRepository(), spaceRepo, new MemoryDeskRepository(), new MemoryBookingRepository());
    service = new DeskService(new MemoryDeskRepository(), spaceRepo, billing);
  });

  it('creates desk in existing space', async () => {
    const result = await service.create(orgId, { spaceId, label: 'D-101' });
    expect(result.ok).toBe(true);
  });

  it('rejects desk for missing space', async () => {
    const result = await service.create(orgId, { spaceId: 'missing', label: 'X' });
    expect(result.ok).toBe(false);
  });
});

