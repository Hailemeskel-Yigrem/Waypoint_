import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateRequireBadgeAccess } from './requireBadgeAccess.js';

describe('rule requireBadgeAccess', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateRequireBadgeAccess(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateRequireBadgeAccess(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
