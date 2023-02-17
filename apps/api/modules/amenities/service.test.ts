import { describe, it, expect, beforeEach } from 'vitest';
import { AmenityService } from '../../src/modules/amenities/service.js';
import { MemoryAmenityRepository } from '../../src/modules/amenities/memory.repository.js';
import { MemorySpaceRepository } from '../../src/modules/spaces/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('AmenityService capacity', () => {
  let service: AmenityService;
  let orgId: string;
  let amenityId: string;

  beforeEach(async () => {
    const orgRepo = new MemoryOrganizationRepository();
    orgId = (await orgRepo.create({ name: 'O', slug: 'amn' })).id;
    const spaceRepo = new MemorySpaceRepository();
    const spaceId = (await spaceRepo.create({ organizationId: orgId, name: 'Gym', type: 'zone' })).id;
    const amenityRepo = new MemoryAmenityRepository();
    amenityId = (await amenityRepo.create({ organizationId: orgId, spaceId, name: 'Gym', type: 'gym', capacity: 2 })).id;
    service = new AmenityService(amenityRepo, spaceRepo);
  });

  it('allows reservation within capacity', async () => {
    const result = await service.reserve(orgId, 'user1', {
      amenityId,
      startTime: new Date('2026-05-01T08:00:00Z'),
      endTime: new Date('2026-05-01T09:00:00Z'),
      partySize: 1,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects when capacity exceeded', async () => {
    const slot = { amenityId, startTime: new Date('2026-05-02T08:00:00Z'), endTime: new Date('2026-05-02T09:00:00Z'), partySize: 2 };
    await service.reserve(orgId, 'u1', slot);
    const result = await service.reserve(orgId, 'u2', { ...slot, partySize: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('CAPACITY_EXCEEDED');
  });
});

