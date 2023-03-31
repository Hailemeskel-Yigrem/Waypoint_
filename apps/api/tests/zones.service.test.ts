import { describe, it, expect } from 'vitest';
import { ZoneService, MemoryZoneRepository } from '@waypoint/domain';

describe('api zones wiring', () => {
  it('creates via domain service', async () => {
    const service = new ZoneService(new MemoryZoneRepository());
    const result = await service.create({
      organizationId: '11111111-1111-1111-1111-111111111111',
      name: 'API Zone',
    });
    expect(result.ok).toBe(true);
  });
});
