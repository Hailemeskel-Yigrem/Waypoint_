import { describe, it, expect } from 'vitest';
import { aggregateNoShowRate, normalizeNoShowRate } from './no_show_rate.js';

describe('no_show_rate', () => {
  it('aggregates samples', () => {
    const result = aggregateNoShowRate([
      { organizationId: 'o', timestamp: '2024-01-01T00:00:00Z', value: 10 },
      { organizationId: 'o', timestamp: '2024-01-01T01:00:00Z', value: 30 },
    ]);
    expect(result.average).toBe(20);
    expect(result.max).toBe(30);
    expect(result.count).toBe(2);
  });

  it('normalizes values', () => {
    expect(normalizeNoShowRate(120)).toBe(100);
    expect(normalizeNoShowRate(-5)).toBe(0);
  });
});
