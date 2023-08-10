import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateBufferBetweenBookings } from './bufferBetweenBookings.js';

describe('rule bufferBetweenBookings', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateBufferBetweenBookings(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateBufferBetweenBookings(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
