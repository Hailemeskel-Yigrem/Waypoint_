import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateRequireCostCenter } from './requireCostCenter.js';

describe('rule requireCostCenter', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateRequireCostCenter(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateRequireCostCenter(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
