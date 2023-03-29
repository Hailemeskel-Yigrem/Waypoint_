import { describe, it, expect } from 'vitest';
import { findConflicts, assertNoConflicts } from './bookingConflict.js';

const base = {
  organizationId: 'org',
  resourceId: 'desk-1',
  status: 'confirmed' as const,
};

describe('bookingConflict', () => {
  it('detects overlaps', () => {
    const candidate = {
      ...base,
      id: 'c',
      start: '2024-01-01T10:00:00Z',
      end: '2024-01-01T11:00:00Z',
    };
    const existing = [
      { ...base, id: 'e', start: '2024-01-01T10:30:00Z', end: '2024-01-01T11:30:00Z' },
    ];
    expect(findConflicts(candidate, existing)).toHaveLength(1);
  });

  it('ignores cancelled bookings', () => {
    const candidate = {
      ...base,
      id: 'c',
      start: '2024-01-01T10:00:00Z',
      end: '2024-01-01T11:00:00Z',
    };
    const existing = [
      {
        ...base,
        id: 'e',
        status: 'cancelled' as const,
        start: '2024-01-01T10:00:00Z',
        end: '2024-01-01T11:00:00Z',
      },
    ];
    expect(() => assertNoConflicts(candidate, existing)).not.toThrow();
  });
});
