import { describe, it, expect } from 'vitest';
import { aggregateAvgMeetingLength, normalizeAvgMeetingLength } from './avg_meeting_length.js';

describe('avg_meeting_length', () => {
  it('aggregates samples', () => {
    const result = aggregateAvgMeetingLength([
      { organizationId: 'o', timestamp: '2024-01-01T00:00:00Z', value: 10 },
      { organizationId: 'o', timestamp: '2024-01-01T01:00:00Z', value: 30 },
    ]);
    expect(result.average).toBe(20);
    expect(result.max).toBe(30);
    expect(result.count).toBe(2);
  });

  it('normalizes values', () => {
    expect(normalizeAvgMeetingLength(120)).toBe(100);
    expect(normalizeAvgMeetingLength(-5)).toBe(0);
  });
});
