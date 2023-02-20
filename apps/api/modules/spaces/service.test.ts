import { describe, it, expect, beforeEach } from 'vitest';
import { SpaceService } from '../../src/modules/spaces/service.js';
import { MemorySpaceRepository } from '../../src/modules/spaces/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemoryDeskRepository } from '../../src/modules/desks/memory.repository.js';
import { MemoryBookingRepository } from '../../src/modules/bookings/memory.repository.js';
import { MemoryBillingRepository } from '../../src/modules/billing/memory.repository.js';
import { BillingService } from '../../src/modules/billing/service.js';

describe('SpaceService', () => {
  let service: SpaceService;
  let orgId: string;

  beforeEach(async () => {
    const orgRepo = new MemoryOrganizationRepository();
    orgId = (await orgRepo.create({ name: 'O', slug: 'o' })).id;
    const billing = new BillingService(new MemoryBillingRepository(), orgRepo, new MemoryUserRepository(), new MemorySpaceRepository(), new MemoryDeskRepository(), new MemoryBookingRepository());
    service = new SpaceService(new MemorySpaceRepository(), billing);
  });

  it('creates space within billing limits', async () => {
    const result = await service.create(orgId, { name: 'Floor 1', type: 'floor', capacity: 50 });
    expect(result.ok).toBe(true);
  });
});

