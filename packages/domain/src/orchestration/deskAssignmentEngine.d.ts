export interface DeskAssignmentEngineInput {
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
export interface DeskAssignmentEngineResult {
    ok: boolean;
    code: string;
    issues: string[];
    score: number;
}
export declare class DeskAssignmentEngine {
    processDeskAssign1(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign2(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign3(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign4(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign5(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign6(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign7(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign8(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign9(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign10(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign11(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign12(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign13(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign14(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign15(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign16(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign17(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign18(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign19(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign20(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign21(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign22(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign23(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign24(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign25(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign26(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign27(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign28(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign29(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign30(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign31(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign32(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign33(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign34(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign35(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign36(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign37(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign38(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign39(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    processDeskAssign40(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult;
    runAll(input: DeskAssignmentEngineInput): DeskAssignmentEngineResult[];
    summarize(results: DeskAssignmentEngineResult[]): {
        passed: number;
        failed: number;
        avgScore: number;
    };
}
//# sourceMappingURL=deskAssignmentEngine.d.ts.map