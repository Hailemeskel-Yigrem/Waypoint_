import { describe, it, expect } from 'vitest';
import { MemoryAmenityRepository } from '../../src/modules/amenities/memory.repository.js';

describe('MemoryAmenityRepository occupancy', () => {
  it('counts party sizes in overlapping slots', async () => {
    const repo = new MemoryAmenityRepository();
    await repo.createReservation({
      organizationId: 'o1', amenityId: 'a1', userId: 'u1',
      startTime: new Date('2026-01-01T09:00:00Z'), endTime: new Date('2026-01-01T10:00:00Z'), partySize: 3,
    });
    const count = await repo.countOccupancy('o1', 'a1', new Date('2026-01-01T09:30:00Z'), new Date('2026-01-01T09:45:00Z'));
    expect(count).toBe(3);
  });
});

