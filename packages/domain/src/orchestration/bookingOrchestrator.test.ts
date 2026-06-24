import { describe, expect, it } from 'vitest';
import { BookingOrchestrator } from './bookingOrchestrator.js';

const input = {
  organizationId: 'org-1',
  resourceId: 'desk-1',
  userId: 'user-1',
  start: '2026-06-25T09:00:00.000Z',
  end: '2026-06-25T10:00:00.000Z',
  attendeeCount: 1,
};

describe('BookingOrchestrator', () => {
  const settings = {
    minMinutes: 30,
    maxMinutes: 240,
    maxAttendees: 12,
    requireNeighborhood: false,
  };

  it('evaluates all configured scenarios without duplicating validation logic', async () => {
    const results = await new BookingOrchestrator(settings, []).runAll(input);

    expect(results).toHaveLength(40);
    expect(results[0]).toMatchObject({ code: 'SCENARIO_1_OK', projection: { priority: 1 } });
    expect(results[39]).toMatchObject({ code: 'SCENARIO_40_OK', projection: { priority: 0 } });
  });

  it('reports invalid ranges and attendee limits together', async () => {
    const result = await new BookingOrchestrator(settings, []).validateScenario(
      { ...input, end: 'not-a-date', attendeeCount: 13 },
      1,
    );

    expect(result).toEqual({
      ok: false,
      code: 'SCENARIO_1_FAILED',
      issues: ['invalid range', 'too many attendees'],
    });
  });

  it('returns the conflicting booking ids and ignores cancelled bookings', async () => {
    const orchestrator = new BookingOrchestrator(settings, [
      { ...input, id: 'active', status: 'confirmed' },
      { ...input, id: 'cancelled', status: 'cancelled' },
    ]);

    await expect(orchestrator.validateScenario(input, 3)).resolves.toEqual({
      ok: false,
      code: 'CONFLICT',
      issues: ['active'],
    });
  });
});
