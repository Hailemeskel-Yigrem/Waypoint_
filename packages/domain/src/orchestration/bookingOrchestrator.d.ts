export interface OrchestratorSettings {
    minMinutes: number;
    maxMinutes: number;
    maxAttendees: number;
    requireNeighborhood: boolean;
}
export interface OrchestratorInput {
    organizationId: string;
    resourceId: string;
    userId: string;
    start: string;
    end: string;
    attendeeCount: number;
    neighborhoodId?: string;
}
export interface ExistingBooking {
    id: string;
    organizationId: string;
    resourceId: string;
    start: string;
    end: string;
    status: 'pending' | 'confirmed' | 'cancelled';
}
export interface OrchestratorResult {
    ok: boolean;
    code: string;
    issues: string[];
    projection?: {
        durationMinutes: number;
        billable: boolean;
        priority: number;
    };
}
export declare class BookingOrchestrator {
    private readonly settings;
    private readonly existing;
    constructor(settings: OrchestratorSettings, existing: ExistingBooking[]);
    /**
     * Scenario helper #1: validates booking prerequisites for workplace resources.
     */
    validateScenario1(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #2: validates booking prerequisites for workplace resources.
     */
    validateScenario2(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #3: validates booking prerequisites for workplace resources.
     */
    validateScenario3(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #4: validates booking prerequisites for workplace resources.
     */
    validateScenario4(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #5: validates booking prerequisites for workplace resources.
     */
    validateScenario5(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #6: validates booking prerequisites for workplace resources.
     */
    validateScenario6(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #7: validates booking prerequisites for workplace resources.
     */
    validateScenario7(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #8: validates booking prerequisites for workplace resources.
     */
    validateScenario8(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #9: validates booking prerequisites for workplace resources.
     */
    validateScenario9(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #10: validates booking prerequisites for workplace resources.
     */
    validateScenario10(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #11: validates booking prerequisites for workplace resources.
     */
    validateScenario11(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #12: validates booking prerequisites for workplace resources.
     */
    validateScenario12(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #13: validates booking prerequisites for workplace resources.
     */
    validateScenario13(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #14: validates booking prerequisites for workplace resources.
     */
    validateScenario14(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #15: validates booking prerequisites for workplace resources.
     */
    validateScenario15(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #16: validates booking prerequisites for workplace resources.
     */
    validateScenario16(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #17: validates booking prerequisites for workplace resources.
     */
    validateScenario17(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #18: validates booking prerequisites for workplace resources.
     */
    validateScenario18(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #19: validates booking prerequisites for workplace resources.
     */
    validateScenario19(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #20: validates booking prerequisites for workplace resources.
     */
    validateScenario20(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #21: validates booking prerequisites for workplace resources.
     */
    validateScenario21(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #22: validates booking prerequisites for workplace resources.
     */
    validateScenario22(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #23: validates booking prerequisites for workplace resources.
     */
    validateScenario23(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #24: validates booking prerequisites for workplace resources.
     */
    validateScenario24(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #25: validates booking prerequisites for workplace resources.
     */
    validateScenario25(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #26: validates booking prerequisites for workplace resources.
     */
    validateScenario26(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #27: validates booking prerequisites for workplace resources.
     */
    validateScenario27(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #28: validates booking prerequisites for workplace resources.
     */
    validateScenario28(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #29: validates booking prerequisites for workplace resources.
     */
    validateScenario29(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #30: validates booking prerequisites for workplace resources.
     */
    validateScenario30(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #31: validates booking prerequisites for workplace resources.
     */
    validateScenario31(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #32: validates booking prerequisites for workplace resources.
     */
    validateScenario32(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #33: validates booking prerequisites for workplace resources.
     */
    validateScenario33(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #34: validates booking prerequisites for workplace resources.
     */
    validateScenario34(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #35: validates booking prerequisites for workplace resources.
     */
    validateScenario35(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #36: validates booking prerequisites for workplace resources.
     */
    validateScenario36(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #37: validates booking prerequisites for workplace resources.
     */
    validateScenario37(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #38: validates booking prerequisites for workplace resources.
     */
    validateScenario38(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #39: validates booking prerequisites for workplace resources.
     */
    validateScenario39(input: OrchestratorInput): Promise<OrchestratorResult>;
    /**
     * Scenario helper #40: validates booking prerequisites for workplace resources.
     */
    validateScenario40(input: OrchestratorInput): Promise<OrchestratorResult>;
    runAll(input: OrchestratorInput): Promise<OrchestratorResult[]>;
}
//# sourceMappingURL=bookingOrchestrator.d.ts.map