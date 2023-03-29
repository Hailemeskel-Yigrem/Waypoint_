import { describe, it, expect } from 'vitest';
import { ResourceService, MemoryResourceRepository } from '@waypoint/domain';

describe('api resources wiring', () => {
  it('creates via domain service', async () => {
    const service = new ResourceService(new MemoryResourceRepository());
    const result = await service.create({
      organizationId: '11111111-1111-1111-1111-111111111111',
      name: 'API Resource',
    });
    expect(result.ok).toBe(true);
  });
});
