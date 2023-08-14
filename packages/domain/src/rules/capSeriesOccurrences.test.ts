import { describe, it, expect } from 'vitest';
import { defaultSettings, evaluateCapSeriesOccurrences } from './capSeriesOccurrences.js';

describe('rule capSeriesOccurrences', () => {
  it('accepts a normal booking context', () => {
    const result = evaluateCapSeriesOccurrences(defaultSettings, {
      durationMinutes: 60,
      advanceDays: 3,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized duration', () => {
    const result = evaluateCapSeriesOccurrences(defaultSettings, {
      durationMinutes: 9999,
    });
    expect(result.ok).toBe(false);
  });
});
