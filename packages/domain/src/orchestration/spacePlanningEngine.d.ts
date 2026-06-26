export interface SpacePlanningEngineInput {
    organizationId: string;
    actorId: string;
    resourceId: string;
    action: 'read' | 'write' | 'delete';
    start?: string;
    end?: string;
    quantity?: number;
    priority?: number;
    channel?: string;
    tags?: string[];
    metadata?: Record<string, unknown>;
    flags?: {
        maintenance?: boolean;
        readonly?: boolean;
    };
}
export interface SpacePlanningEngineResult {
    ok: boolean;
    code: string;
    issues: string[];
    score: number;
}
export declare class SpacePlanningEngine {
    processSpacePlan1(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan2(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan3(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan4(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan5(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan6(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan7(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan8(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan9(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan10(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan11(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan12(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan13(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan14(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan15(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan16(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan17(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan18(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan19(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan20(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan21(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan22(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan23(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan24(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan25(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan26(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan27(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan28(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan29(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan30(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan31(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan32(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan33(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan34(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan35(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan36(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan37(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan38(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan39(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    processSpacePlan40(input: SpacePlanningEngineInput): SpacePlanningEngineResult;
    runAll(input: SpacePlanningEngineInput): SpacePlanningEngineResult[];
    summarize(results: SpacePlanningEngineResult[]): {
        passed: number;
        failed: number;
        avgScore: number;
    };
}
//# sourceMappingURL=spacePlanningEngine.d.ts.map