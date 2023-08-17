import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateMaxBookingDurationMinutes } from './maxBookingDurationMinutes.js';

describe('rule maxBookingDurationMinutes', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateMaxBookingDurationMinutes(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateMaxBookingDurationMinutes(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
