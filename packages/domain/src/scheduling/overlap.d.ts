export interface TimeRange {
    start: Date;
    end: Date;
}
export declare function assertValidRange(range: TimeRange): void;
export declare function rangesOverlap(a: TimeRange, b: TimeRange): boolean;
export declare function findOverlaps<T extends TimeRange>(candidate: TimeRange, existing: T[]): T[];
export declare function durationMinutes(range: TimeRange): number;
export declare function clampToBusinessHours(range: TimeRange, openHour: number, closeHour: number, timeZoneOffsetMinutes?: number): TimeRange;
//# sourceMappingURL=overlap.d.ts.map