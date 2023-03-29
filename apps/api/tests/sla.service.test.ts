import { describe, it, expect } from 'vitest';
import { SlaTargetService, MemorySlaTargetRepository } from '@waypoint/domain';

describe('api sla wiring', () => {
  it('creates via domain service', async () => {
    const service = new SlaTargetService(new MemorySlaTargetRepository());
    const result = await service.create({
      organizationId: '11111111-1111-1111-1111-111111111111',
      name: 'API SlaTarget',
    });
    expect(result.ok).toBe(true);
  });
});
