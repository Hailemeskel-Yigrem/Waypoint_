import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateBlockMaintenanceWindows } from './blockMaintenanceWindows.js';

describe('rule blockMaintenanceWindows', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateBlockMaintenanceWindows(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateBlockMaintenanceWindows(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
