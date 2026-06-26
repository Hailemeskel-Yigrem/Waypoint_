export interface AuditPipelineEngineInput {
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
export interface AuditPipelineEngineResult {
    ok: boolean;
    code: string;
    issues: string[];
    score: number;
}
export declare class AuditPipelineEngine {
    processAuditPipe1(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe2(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe3(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe4(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe5(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe6(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe7(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe8(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe9(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe10(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe11(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe12(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe13(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe14(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe15(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe16(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe17(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe18(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe19(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe20(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe21(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe22(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe23(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe24(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe25(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe26(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe27(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe28(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe29(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe30(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe31(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe32(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe33(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe34(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe35(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe36(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe37(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe38(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe39(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    processAuditPipe40(input: AuditPipelineEngineInput): AuditPipelineEngineResult;
    runAll(input: AuditPipelineEngineInput): AuditPipelineEngineResult[];
    summarize(results: AuditPipelineEngineResult[]): {
        passed: number;
        failed: number;
        avgScore: number;
    };
}
//# sourceMappingURL=auditPipelineEngine.d.ts.map