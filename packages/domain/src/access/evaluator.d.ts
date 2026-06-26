export type Role = 'owner' | 'admin' | 'manager' | 'member' | 'receptionist' | 'guest';
export interface AccessEvalInput {
    organizationId: string;
    principalId: string;
    role: Role;
    action: string;
    resourceType: string;
    attributes?: Record<string, string | number | boolean>;
}
export interface AccessEvalResult {
    allowed: boolean;
    reasons: string[];
    caseId: number;
}
export declare function evaluateAccessCase1(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase2(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase3(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase4(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase5(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase6(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase7(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase8(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase9(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase10(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase11(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase12(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase13(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase14(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase15(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase16(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase17(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase18(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase19(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase20(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase21(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase22(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase23(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase24(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase25(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase26(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase27(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase28(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase29(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAccessCase30(input: AccessEvalInput): AccessEvalResult;
export declare function evaluateAllAccessCases(input: AccessEvalInput): AccessEvalResult[];
//# sourceMappingURL=evaluator.d.ts.map