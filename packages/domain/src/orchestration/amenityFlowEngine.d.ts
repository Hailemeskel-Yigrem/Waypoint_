export interface AmenityFlowEngineInput {
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
export interface AmenityFlowEngineResult {
    ok: boolean;
    code: string;
    issues: string[];
    score: number;
}
export declare class AmenityFlowEngine {
    processAmenity1(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity2(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity3(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity4(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity5(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity6(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity7(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity8(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity9(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity10(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity11(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity12(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity13(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity14(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity15(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity16(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity17(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity18(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity19(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity20(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity21(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity22(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity23(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity24(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity25(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity26(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity27(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity28(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity29(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity30(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity31(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity32(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity33(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity34(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    processAmenity35(input: AmenityFlowEngineInput): AmenityFlowEngineResult;
    runAll(input: AmenityFlowEngineInput): AmenityFlowEngineResult[];
    summarize(results: AmenityFlowEngineResult[]): {
        passed: number;
        failed: number;
        avgScore: number;
    };
}
//# sourceMappingURL=amenityFlowEngine.d.ts.map