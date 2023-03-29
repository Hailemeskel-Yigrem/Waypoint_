import { describe, it, expect } from 'vitest';
import { PolicyService, MemoryPolicyRepository } from '@waypoint/domain';

describe('api policies wiring', () => {
  it('creates via domain service', async () => {
    const service = new PolicyService(new MemoryPolicyRepository());
    const result = await service.create({
      organizationId: '11111111-1111-1111-1111-111111111111',
      name: 'API Policy',
    });
    expect(result.ok).toBe(true);
  });
});
