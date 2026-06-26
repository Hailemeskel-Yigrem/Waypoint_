export interface VisitorFlowEngineInput {
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
export interface VisitorFlowEngineResult {
    ok: boolean;
    code: string;
    issues: string[];
    score: number;
}
export declare class VisitorFlowEngine {
    processVisitor1(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor2(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor3(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor4(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor5(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor6(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor7(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor8(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor9(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor10(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor11(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor12(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor13(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor14(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor15(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor16(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor17(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor18(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor19(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor20(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor21(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor22(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor23(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor24(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor25(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor26(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor27(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor28(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor29(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor30(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor31(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor32(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor33(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor34(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    processVisitor35(input: VisitorFlowEngineInput): VisitorFlowEngineResult;
    runAll(input: VisitorFlowEngineInput): VisitorFlowEngineResult[];
    summarize(results: VisitorFlowEngineResult[]): {
        passed: number;
        failed: number;
        avgScore: number;
    };
}
//# sourceMappingURL=visitorFlowEngine.d.ts.map