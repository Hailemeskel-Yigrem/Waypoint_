import { describe, it, expect } from 'vitest';
import { MemoryBookingRepository } from '../../src/modules/bookings/memory.repository.js';

describe('MemoryBookingRepository conflicts', () => {
  it('finds overlapping bookings', async () => {
    const repo = new MemoryBookingRepository();
    await repo.create({
      organizationId: 'org1', userId: 'u1', deskId: 'd1', spaceId: null,
      title: 'A', startTime: new Date('2026-01-01T09:00:00Z'), endTime: new Date('2026-01-01T11:00:00Z'),
    });
    const conflicts = await repo.findConflicts({
      organizationId: 'org1', deskId: 'd1',
      startTime: new Date('2026-01-01T10:00:00Z'), endTime: new Date('2026-01-01T12:00:00Z'),
    });
    expect(conflicts).toHaveLength(1);
  });
});

