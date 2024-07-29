import { describe, it, expect } from 'vitest';
import { aggregateDeskUtilization, normalizeDeskUtilization } from './desk_utilization.js';

describe('desk_utilization', () => {
  it('aggregates samples', () => {
    const result = aggregateDeskUtilization([
      { organizationId: 'o', timestamp: '2024-01-01T00:00:00Z', value: 10 },
      { organizationId: 'o', timestamp: '2024-01-01T01:00:00Z', value: 30 },
    ]);
    expect(result.average).toBe(20);
    expect(result.max).toBe(30);
    expect(result.count).toBe(2);
  });

  it('normalizes values', () => {
    expect(normalizeDeskUtilization(120)).toBe(100);
    expect(normalizeDeskUtilization(-5)).toBe(0);
  });
});
