import { describe, it, expect } from 'vitest';
import { FloorService, MemoryFloorRepository } from '@waypoint/domain';

describe('api floors wiring', () => {
  it('creates via domain service', async () => {
    const service = new FloorService(new MemoryFloorRepository());
    const result = await service.create({
      organizationId: '11111111-1111-1111-1111-111111111111',
      name: 'API Floor',
    });
    expect(result.ok).toBe(true);
  });
});
