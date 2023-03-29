import { describe, it, expect } from 'vitest';
import { AssetService, MemoryAssetRepository } from '@waypoint/domain';

describe('api assets wiring', () => {
  it('creates via domain service', async () => {
    const service = new AssetService(new MemoryAssetRepository());
    const result = await service.create({
      organizationId: '11111111-1111-1111-1111-111111111111',
      name: 'API Asset',
    });
    expect(result.ok).toBe(true);
  });
});
