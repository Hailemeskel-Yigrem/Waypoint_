export const defaultSettings = {
    maxAdvanceBookingDays: 30,
    minBookingDurationMinutes: 30,
    maxBookingDurationMinutes: 480,
    bufferMinutes: 0,
    businessOpenHour: 7,
    businessCloseHour: 20,
    requireCheckin: true,
    allowGuests: false,
    maxConcurrentDesksPerUser: 1,
    maxDailyVisitors: 100,
};
export function evaluateRequireBadgeAccess(settings, context) {
    // Domain rule: requireBadgeAccess
    if (settings.maxAdvanceBookingDays < 1) {
        return { ok: false, reason: 'invalid maxAdvanceBookingDays' };
    }
    if (settings.minBookingDurationMinutes > settings.maxBookingDurationMinutes) {
        return { ok: false, reason: 'min duration exceeds max duration' };
    }
    if (typeof context.durationMinutes === 'number') {
        if (context.durationMinutes < settings.minBookingDurationMinutes) {
            return { ok: false, reason: 'booking too short' };
        }
        if (context.durationMinutes > settings.maxBookingDurationMinutes) {
            return { ok: false, reason: 'booking too long' };
        }
    }
    if (typeof context.advanceDays === 'number' &&
        context.advanceDays > settings.maxAdvanceBookingDays) {
        return { ok: false, reason: 'booking too far in advance' };
    }
    if (settings.requireCheckin && context.checkedIn === false && context.phase === 'active') {
        return { ok: false, reason: 'check-in required' };
    }
    if (!settings.allowGuests && context.isGuest === true) {
        return { ok: false, reason: 'guest bookings disabled' };
    }
    return { ok: true };
}
//# sourceMappingURL=requireBadgeAccess.js.map