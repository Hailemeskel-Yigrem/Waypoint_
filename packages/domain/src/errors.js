export class DomainError extends Error {
    code;
    statusCode;
    constructor(message, code, statusCode = 400) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'DomainError';
    }
}
export class ValidationError extends DomainError {
    constructor(message) {
        super(message, 'VALIDATION_ERROR', 400);
        this.name = 'ValidationError';
    }
}
export class NotFoundError extends DomainError {
    constructor(message) {
        super(message, 'NOT_FOUND', 404);
        this.name = 'NotFoundError';
    }
}
export class ConflictError extends DomainError {
    constructor(message) {
        super(message, 'CONFLICT', 409);
        this.name = 'ConflictError';
    }
}
export class ForbiddenError extends DomainError {
    constructor(message) {
        super(message, 'FORBIDDEN', 403);
        this.name = 'ForbiddenError';
    }
}
//# sourceMappingURL=errors.js.map