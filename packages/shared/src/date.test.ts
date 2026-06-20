import { describe, it, expect } from 'vitest';
import { addMinutes, overlaps, formatDuration, isSameDay, startOfDay } from '../utils/date.js';

describe('date utils', () => {
  it('addMinutes', () => {
    const d = new Date('2026-01-01T10:00:00Z');
    expect(addMinutes(d, 30).toISOString()).toBe('2026-01-01T10:30:00.000Z');
  });
  it('overlaps', () => {
    const a1 = new Date('2026-01-01T09:00:00Z');
    const a2 = new Date('2026-01-01T11:00:00Z');
    const b1 = new Date('2026-01-01T10:00:00Z');
    const b2 = new Date('2026-01-01T12:00:00Z');
    expect(overlaps(a1, a2, b1, b2)).toBe(true);
  });
  it('formatDuration', () => {
    expect(formatDuration(90)).toBe('1h 30m');
  });
  it('isSameDay', () => {
    expect(isSameDay(new Date('2026-01-01T08:00:00Z'), new Date('2026-01-01T20:00:00Z'))).toBe(
      true,
    );
  });
  it('startOfDay', () => {
    const d = startOfDay(new Date('2026-01-01T15:30:00Z'));
    expect(d.getHours()).toBe(0);
  });
});
