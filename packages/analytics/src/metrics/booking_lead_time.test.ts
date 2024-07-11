import { describe, it, expect } from 'vitest';
import { aggregateBookingLeadTime, normalizeBookingLeadTime } from './booking_lead_time.js';

describe('booking_lead_time', () => {
  it('aggregates samples', () => {
    const result = aggregateBookingLeadTime([
      { organizationId: 'o', timestamp: '2024-01-01T00:00:00Z', value: 10 },
      { organizationId: 'o', timestamp: '2024-01-01T01:00:00Z', value: 30 },
    ]);
    expect(result.average).toBe(20);
    expect(result.max).toBe(30);
    expect(result.count).toBe(2);
  });

  it('normalizes values', () => {
    expect(normalizeBookingLeadTime(120)).toBe(100);
    expect(normalizeBookingLeadTime(-5)).toBe(0);
  });
});
