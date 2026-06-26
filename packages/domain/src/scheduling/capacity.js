export function remainingCapacity(pool, reservations, rangeStart, rangeEnd) {
    const used = reservations
        .filter((r) => r.poolId === pool.id)
        .filter((r) => r.rangeStart < rangeEnd && rangeStart < r.rangeEnd)
        .reduce((sum, r) => sum + r.seats, 0);
    return Math.max(0, pool.hardLimit - used);
}
export function canReserve(pool, reservations, seats, rangeStart, rangeEnd) {
    const remaining = remainingCapacity(pool, reservations, rangeStart, rangeEnd);
    const allowed = seats > 0 && seats <= remaining;
    const projected = pool.hardLimit - remaining + seats;
    const softExceeded = pool.softLimit !== undefined && projected > pool.softLimit;
    return { allowed, remaining, softExceeded };
}
//# sourceMappingURL=capacity.js.map