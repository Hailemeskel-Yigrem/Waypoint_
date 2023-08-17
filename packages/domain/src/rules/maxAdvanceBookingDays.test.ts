import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateMaxAdvanceBookingDays } from './maxAdvanceBookingDays.js';

describe('rule maxAdvanceBookingDays', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateMaxAdvanceBookingDays(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateMaxAdvanceBookingDays(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
