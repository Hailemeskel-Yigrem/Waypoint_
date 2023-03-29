import { describe, it, expect } from 'vitest';
import { InviteService, MemoryInviteRepository } from '@waypoint/domain';

describe('api invites wiring', () => {
  it('creates via domain service', async () => {
    const service = new InviteService(new MemoryInviteRepository());
    const result = await service.create({
      organizationId: '11111111-1111-1111-1111-111111111111',
      name: 'API Invite',
    });
    expect(result.ok).toBe(true);
  });
});
