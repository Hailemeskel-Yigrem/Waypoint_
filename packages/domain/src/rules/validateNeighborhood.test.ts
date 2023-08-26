import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateValidateNeighborhood } from './validateNeighborhood.js';

describe('rule validateNeighborhood', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateValidateNeighborhood(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateValidateNeighborhood(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
