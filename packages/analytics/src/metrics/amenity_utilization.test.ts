import { describe, it, expect } from 'vitest';
import { aggregateAmenityUtilization, normalizeAmenityUtilization } from './amenity_utilization.js';

describe('amenity_utilization', () => {
  it('aggregates samples', () => {
    const result = aggregateAmenityUtilization([
      { organizationId: 'o', timestamp: '2024-01-01T00:00:00Z', value: 10 },
      { organizationId: 'o', timestamp: '2024-01-01T01:00:00Z', value: 30 },
    ]);
    expect(result.average).toBe(20);
    expect(result.max).toBe(30);
    expect(result.count).toBe(2);
  });

  it('normalizes values', () => {
    expect(normalizeAmenityUtilization(120)).toBe(100);
    expect(normalizeAmenityUtilization(-5)).toBe(0);
  });
});
