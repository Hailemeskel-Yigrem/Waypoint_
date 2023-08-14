import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateLimitConcurrentDesks } from './limitConcurrentDesks.js';

describe('rule limitConcurrentDesks', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateLimitConcurrentDesks(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateLimitConcurrentDesks(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
