import { describe, it, expect, beforeEach } from 'vitest';
import { AnalyticsService } from '../../src/modules/analytics/service.js';
import { AnalyticsDataRepository } from '../../src/modules/analytics/memory.repository.js';
import { MemoryDeskRepository } from '../../src/modules/desks/memory.repository.js';
import { MemoryBookingRepository } from '../../src/modules/bookings/memory.repository.js';
import { MemoryVisitorRepository } from '../../src/modules/visitors/memory.repository.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemorySpaceRepository } from '../../src/modules/spaces/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let orgId: string;

  beforeEach(async () => {
    orgId = (await new MemoryOrganizationRepository().create({ name: 'O', slug: 'ana' })).id;
    const desks = new MemoryDeskRepository();
    const bookings = new MemoryBookingRepository();
    const repo = new AnalyticsDataRepository(
      desks,
      bookings,
      new MemoryVisitorRepository(),
      new MemoryUserRepository(),
      new MemorySpaceRepository(),
    );
    service = new AnalyticsService(repo);
  });

  it('returns dashboard summary', async () => {
    const result = await service.dashboard(orgId);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.organizationId).toBe(orgId);
  });
});
