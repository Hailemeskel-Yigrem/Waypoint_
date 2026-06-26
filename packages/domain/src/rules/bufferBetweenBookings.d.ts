export interface OrgBookingSettings {
    maxAdvanceBookingDays: number;
    minBookingDurationMinutes: number;
    maxBookingDurationMinutes: number;
    bufferMinutes: number;
    businessOpenHour: number;
    businessCloseHour: number;
    requireCheckin: boolean;
    allowGuests: boolean;
    maxConcurrentDesksPerUser: number;
    maxDailyVisitors: number;
}
export declare const defaultSettings: OrgBookingSettings;
export declare function evaluateBufferBetweenBookings(settings: OrgBookingSettings, context: Record<string, number | boolean | string>): {
    ok: boolean;
    reason?: string;
};
//# sourceMappingURL=bufferBetweenBookings.d.ts.map