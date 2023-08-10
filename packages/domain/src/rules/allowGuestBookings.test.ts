import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateAllowGuestBookings } from './allowGuestBookings.js';

describe('rule allowGuestBookings', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateAllowGuestBookings(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateAllowGuestBookings(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
