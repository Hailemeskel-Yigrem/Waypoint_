import { describe, it, expect } from 'vitest';
import { BookingOrchestrator } from './bookingOrchestrator.js';

describe('BookingOrchestrator', () => {
  const orch = new BookingOrchestrator(
    { minMinutes: 30, maxMinutes: 240, maxAttendees: 12, requireNeighborhood: false },
    [],
  );

  it('passes a valid booking across scenarios', async () => {
    const results = await orch.runAll({
      organizationId: 'org',
      resourceId: 'desk-1',
      userId: 'user-1',
      start: '2024-06-01T09:00:00Z',
      end: '2024-06-01T10:00:00Z',
      attendeeCount: 1,
    });
    expect(results.every((r) => r.ok)).toBe(true);
  });

  it('fails invalid ranges', async () => {
    const result = await orch.validateScenario1({
      organizationId: 'org',
      resourceId: 'desk-1',
      userId: 'user-1',
      start: '2024-06-01T11:00:00Z',
      end: '2024-06-01T10:00:00Z',
      attendeeCount: 1,
    });
    expect(result.ok).toBe(false);
  });
});
