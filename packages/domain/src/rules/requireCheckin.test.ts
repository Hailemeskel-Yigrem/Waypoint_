import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateRequireCheckin } from './requireCheckin.js';

describe('rule requireCheckin', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateRequireCheckin(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateRequireCheckin(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
