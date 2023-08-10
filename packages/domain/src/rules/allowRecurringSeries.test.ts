import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateAllowRecurringSeries } from './allowRecurringSeries.js';

describe('rule allowRecurringSeries', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateAllowRecurringSeries(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateAllowRecurringSeries(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
