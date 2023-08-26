import { describe, it, expect } from 'vitest';
import { canReserve, remainingCapacity } from './capacity.js';

describe('capacity', () => {
  const pool = { id: 'p1', hardLimit: 10, softLimit: 8 };

  it('tracks remaining seats', () => {
    const reservations = [
      {
        poolId: 'p1',
        seats: 4,
        rangeStart: '2024-01-01T09:00:00Z',
        rangeEnd: '2024-01-01T10:00:00Z',
      },
    ];
    expect(
      remainingCapacity(pool, reservations, '2024-01-01T09:00:00Z', '2024-01-01T10:00:00Z'),
    ).toBe(6);
  });

  it('blocks over-capacity reservations', () => {
    const reservations = [
      {
        poolId: 'p1',
        seats: 9,
        rangeStart: '2024-01-01T09:00:00Z',
        rangeEnd: '2024-01-01T10:00:00Z',
      },
    ];
    const result = canReserve(
      pool,
      reservations,
      2,
      '2024-01-01T09:00:00Z',
      '2024-01-01T10:00:00Z',
    );
    expect(result.allowed).toBe(false);
  });
});
