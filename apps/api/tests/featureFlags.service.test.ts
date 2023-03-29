import { describe, it, expect } from 'vitest';
import { FeatureFlagService, MemoryFeatureFlagRepository } from '@waypoint/domain';

describe('api featureFlags wiring', () => {
  it('creates via domain service', async () => {
    const service = new FeatureFlagService(new MemoryFeatureFlagRepository());
    const result = await service.create({
      organizationId: '11111111-1111-1111-1111-111111111111',
      name: 'API FeatureFlag',
    });
    expect(result.ok).toBe(true);
  });
});
