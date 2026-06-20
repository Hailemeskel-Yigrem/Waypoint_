import { describe, it, expect, beforeEach } from 'vitest';
import { VisitorService } from '../../src/modules/visitors/service.js';
import { MemoryVisitorRepository } from '../../src/modules/visitors/memory.repository.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('VisitorService', () => {
  let service: VisitorService;
  let orgId: string;
  let hostId: string;

  beforeEach(async () => {
    const orgRepo = new MemoryOrganizationRepository();
    orgId = (await orgRepo.create({ name: 'O', slug: 'vis' })).id;
    const userRepo = new MemoryUserRepository();
    hostId = (await userRepo.create({ organizationId: orgId, email: 'host@t.com', name: 'Host' }))
      .id;
    await userRepo.update(orgId, hostId, { status: 'active' });
    service = new VisitorService(new MemoryVisitorRepository(), userRepo, orgRepo);
  });

  it('requires active host', async () => {
    const result = await service.create(orgId, {
      hostUserId: 'missing',
      name: 'Guest',
      expectedArrival: new Date('2026-04-01T10:00:00Z'),
    });
    expect(result.ok).toBe(false);
  });

  it('creates visitor with check-in window', async () => {
    const result = await service.create(orgId, {
      hostUserId: hostId,
      name: 'Guest',
      expectedArrival: new Date('2026-04-01T10:00:00Z'),
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.checkInWindowStart.getTime()).toBeLessThan(
        result.value.expectedArrival.getTime(),
      );
    }
  });

  it('rejects check-in outside window', async () => {
    const created = await service.create(orgId, {
      hostUserId: hostId,
      name: 'Guest',
      expectedArrival: new Date('2026-04-01T10:00:00Z'),
      checkInWindowMinutes: 15,
    });
    const visitorId = created.ok ? created.value.id : '';
    const checkIn = await service.checkIn(orgId, visitorId);
    expect(checkIn.ok).toBe(false);
  });
});
