export declare class DomainError extends Error {
    readonly code: string;
    readonly statusCode: number;
    constructor(message: string, code: string, statusCode?: number);
}
export declare class ValidationError extends DomainError {
    constructor(message: string);
}
export declare class NotFoundError extends DomainError {
    constructor(message: string);
}
export declare class ConflictError extends DomainError {
    constructor(message: string);
}
export declare class ForbiddenError extends DomainError {
    constructor(message: string);
}
//# sourceMappingURL=errors.d.ts.map