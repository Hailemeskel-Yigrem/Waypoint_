import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateRequireManagerApproval } from './requireManagerApproval.js';

describe('rule requireManagerApproval', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateRequireManagerApproval(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateRequireManagerApproval(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
