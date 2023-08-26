import { describe, it, expect } from 'vitest';
import { rangesOverlap, findOverlaps, durationMinutes } from './overlap.js';

describe('scheduling overlap', () => {
  it('detects overlapping ranges', () => {
    const a = { start: new Date('2024-06-01T10:00:00Z'), end: new Date('2024-06-01T11:00:00Z') };
    const b = { start: new Date('2024-06-01T10:30:00Z'), end: new Date('2024-06-01T11:30:00Z') };
    expect(rangesOverlap(a, b)).toBe(true);
  });

  it('allows adjacent ranges', () => {
    const a = { start: new Date('2024-06-01T10:00:00Z'), end: new Date('2024-06-01T11:00:00Z') };
    const b = { start: new Date('2024-06-01T11:00:00Z'), end: new Date('2024-06-01T12:00:00Z') };
    expect(rangesOverlap(a, b)).toBe(false);
  });

  it('computes duration', () => {
    const a = { start: new Date('2024-06-01T10:00:00Z'), end: new Date('2024-06-01T11:30:00Z') };
    expect(durationMinutes(a)).toBe(90);
  });

  it('finds overlapping bookings', () => {
    const candidate = {
      start: new Date('2024-06-01T09:00:00Z'),
      end: new Date('2024-06-01T10:00:00Z'),
    };
    const existing = [
      { id: '1', start: new Date('2024-06-01T09:30:00Z'), end: new Date('2024-06-01T10:30:00Z') },
      { id: '2', start: new Date('2024-06-01T11:00:00Z'), end: new Date('2024-06-01T12:00:00Z') },
    ];
    expect(findOverlaps(candidate, existing)).toHaveLength(1);
  });
});
