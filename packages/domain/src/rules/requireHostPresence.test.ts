import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateRequireHostPresence } from './requireHostPresence.js';

describe('rule requireHostPresence', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateRequireHostPresence(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateRequireHostPresence(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
