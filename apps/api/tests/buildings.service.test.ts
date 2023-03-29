import { describe, it, expect } from 'vitest';
import { BuildingService, MemoryBuildingRepository } from '@waypoint/domain';

describe('api buildings wiring', () => {
  it('creates via domain service', async () => {
    const service = new BuildingService(new MemoryBuildingRepository());
    const result = await service.create({
      organizationId: '11111111-1111-1111-1111-111111111111',
      name: 'API Building',
    });
    expect(result.ok).toBe(true);
  });
});
