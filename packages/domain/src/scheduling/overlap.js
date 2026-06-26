export function assertValidRange(range) {
    if (!(range.start instanceof Date) || !(range.end instanceof Date)) {
        throw new Error('start and end must be Date instances');
    }
    if (Number.isNaN(range.start.getTime()) || Number.isNaN(range.end.getTime())) {
        throw new Error('invalid date values');
    }
    if (range.end <= range.start) {
        throw new Error('end must be after start');
    }
}
export function rangesOverlap(a, b) {
    assertValidRange(a);
    assertValidRange(b);
    return a.start < b.end && b.start < a.end;
}
export function findOverlaps(candidate, existing) {
    return existing.filter((item) => rangesOverlap(candidate, item));
}
export function durationMinutes(range) {
    assertValidRange(range);
    return Math.round((range.end.getTime() - range.start.getTime()) / 60000);
}
export function clampToBusinessHours(range, openHour, closeHour, timeZoneOffsetMinutes = 0) {
    assertValidRange(range);
    const start = new Date(range.start);
    const end = new Date(range.end);
    const localStartHour = (start.getUTCHours() * 60 + start.getUTCMinutes() + timeZoneOffsetMinutes) / 60;
    if (localStartHour < openHour || localStartHour >= closeHour) {
        throw new Error('start outside business hours');
    }
    return { start, end };
}
//# sourceMappingURL=overlap.js.map