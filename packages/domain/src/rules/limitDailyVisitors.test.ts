import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateLimitDailyVisitors } from './limitDailyVisitors.js';

describe('rule limitDailyVisitors', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateLimitDailyVisitors(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateLimitDailyVisitors(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
