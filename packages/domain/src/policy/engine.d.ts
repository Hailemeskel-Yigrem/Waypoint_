export type Effect = 'allow' | 'deny';
export interface PolicyRule {
    id: string;
    priority: number;
    effect: Effect;
    actions: string[];
    resources: string[];
    roles?: string[];
    conditions?: Record<string, string | number | boolean>;
}
export interface PolicyRequest {
    action: string;
    resource: string;
    role: string;
    attributes?: Record<string, string | number | boolean>;
}
export interface PolicyDecision {
    effect: Effect;
    matchedRuleId?: string;
    reason: string;
}
export declare function evaluatePolicies(rules: PolicyRule[], request: PolicyRequest): PolicyDecision;
//# sourceMappingURL=engine.d.ts.map