export interface CapacityPool {
  id: string;
  hardLimit: number;
  softLimit?: number;
}

export interface CapacityReservation {
  poolId: string;
  seats: number;
  rangeStart: string;
  rangeEnd: string;
}

export function remainingCapacity(
  pool: CapacityPool,
  reservations: CapacityReservation[],
  rangeStart: string,
  rangeEnd: string,
): number {
  const used = reservations
    .filter((r) => r.poolId === pool.id)
    .filter((r) => r.rangeStart < rangeEnd && rangeStart < r.rangeEnd)
    .reduce((sum, r) => sum + r.seats, 0);
  return Math.max(0, pool.hardLimit - used);
}

export function canReserve(
  pool: CapacityPool,
  reservations: CapacityReservation[],
  seats: number,
  rangeStart: string,
  rangeEnd: string,
): { allowed: boolean; remaining: number; softExceeded: boolean } {
  const remaining = remainingCapacity(pool, reservations, rangeStart, rangeEnd);
  const allowed = seats > 0 && seats <= remaining;
  const projected = pool.hardLimit - remaining + seats;
  const softExceeded = pool.softLimit !== undefined && projected > pool.softLimit;
  return { allowed, remaining, softExceeded };
}
