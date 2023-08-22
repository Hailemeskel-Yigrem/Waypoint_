import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateRequireFloorAssignment } from './requireFloorAssignment.js';

describe('rule requireFloorAssignment', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateRequireFloorAssignment(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateRequireFloorAssignment(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
