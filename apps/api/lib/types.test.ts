import { describe, it, expect } from 'vitest';
import { overlaps, isWithinWindow, BILLING_LIMITS } from '../../src/lib/types.js';

describe('shared types helpers', () => {
  it('detects time overlaps', () => {
    const s = new Date('2026-01-01T09:00:00Z');
    const e = new Date('2026-01-01T11:00:00Z');
    const s2 = new Date('2026-01-01T10:00:00Z');
    const e2 = new Date('2026-01-01T12:00:00Z');
    expect(overlaps(s, e, s2, e2)).toBe(true);
  });

  it('checks window membership', () => {
    const t = new Date('2026-01-01T10:00:00Z');
    const start = new Date('2026-01-01T09:00:00Z');
    const end = new Date('2026-01-01T11:00:00Z');
    expect(isWithinWindow(t, start, end)).toBe(true);
  });

  it('defines billing limits per plan', () => {
    expect(BILLING_LIMITS.free.maxSeats).toBe(5);
    expect(BILLING_LIMITS.enterprise.maxSpaces).toBeGreaterThan(100);
  });
});

