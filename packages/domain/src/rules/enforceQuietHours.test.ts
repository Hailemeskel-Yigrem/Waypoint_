import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateEnforceQuietHours } from './enforceQuietHours.js';

describe('rule enforceQuietHours', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateEnforceQuietHours(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateEnforceQuietHours(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
