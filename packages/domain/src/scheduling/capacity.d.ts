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
export declare function remainingCapacity(pool: CapacityPool, reservations: CapacityReservation[], rangeStart: string, rangeEnd: string): number;
export declare function canReserve(pool: CapacityPool, reservations: CapacityReservation[], seats: number, rangeStart: string, rangeEnd: string): {
    allowed: boolean;
    remaining: number;
    softExceeded: boolean;
};
//# sourceMappingURL=capacity.d.ts.map