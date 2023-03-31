import { describe, it, expect } from 'vitest';
import { TeamService, MemoryTeamRepository } from '@waypoint/domain';

describe('api teams wiring', () => {
  it('creates via domain service', async () => {
    const service = new TeamService(new MemoryTeamRepository());
    const result = await service.create({
      organizationId: '11111111-1111-1111-1111-111111111111',
      name: 'API Team',
    });
    expect(result.ok).toBe(true);
  });
});
