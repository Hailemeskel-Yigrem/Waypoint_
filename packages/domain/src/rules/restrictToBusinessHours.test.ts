import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateRestrictToBusinessHours } from './restrictToBusinessHours.js';

describe('rule restrictToBusinessHours', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateRestrictToBusinessHours(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateRestrictToBusinessHours(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
