import { describe, it, expect } from 'vitest';
import { CheckInService, MemoryCheckInRepository } from '@waypoint/domain';

describe('api checkins wiring', () => {
  it('creates via domain service', async () => {
    const service = new CheckInService(new MemoryCheckInRepository());
    const result = await service.create({
      organizationId: '11111111-1111-1111-1111-111111111111',
      name: 'API CheckIn',
    });
    expect(result.ok).toBe(true);
  });
});
