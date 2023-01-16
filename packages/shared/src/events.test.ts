import { describe, it, expect } from 'vitest';
import { WaypointEvents, createEventPayload } from '../events.js';

describe('events', () => {
  it('has stable event names', () => {
    expect(WaypointEvents.BOOKING_CREATED).toBe('waypoint.booking.created');
  });
  it('creates payload', () => {
    const p = createEventPayload(WaypointEvents.USER_CREATED, 'org-1', { id: 'u1' }, 'corr-1');
    expect(p.orgId).toBe('org-1');
    expect(p.correlationId).toBe('corr-1');
  });
});
