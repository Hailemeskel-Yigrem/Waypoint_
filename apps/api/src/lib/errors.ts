export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'TENANT_MISMATCH'
  | 'BILLING_LIMIT'
  | 'CAPACITY_EXCEEDED'
  | 'BOOKING_OVERLAP'
  | 'ACCESS_DENIED'
  | 'INVALID_STATE';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }

  static validation(message: string, details?: Record<string, unknown>): AppError {
    return new AppError('VALIDATION_ERROR', message, 400, details);
  }

  static notFound(resource: string, id?: string): AppError {
    const msg = id ? `${resource} '${id}' not found` : `${resource} not found`;
    return new AppError('NOT_FOUND', msg, 404, { resource, id });
  }

  static conflict(message: string, details?: Record<string, unknown>): AppError {
    return new AppError('CONFLICT', message, 409, details);
  }

  static unauthorized(message = 'Unauthorized'): AppError {
    return new AppError('UNAUTHORIZED', message, 401);
  }

  static forbidden(message = 'Forbidden'): AppError {
    return new AppError('FORBIDDEN', message, 403);
  }

  static tenantMismatch(): AppError {
    return new AppError('TENANT_MISMATCH', 'Resource belongs to a different organization', 403);
  }

  static billingLimit(message: string, details?: Record<string, unknown>): AppError {
    return new AppError('BILLING_LIMIT', message, 402, details);
  }

  static capacityExceeded(message: string, details?: Record<string, unknown>): AppError {
    return new AppError('CAPACITY_EXCEEDED', message, 409, details);
  }

  static bookingOverlap(details?: Record<string, unknown>): AppError {
    return new AppError('BOOKING_OVERLAP', 'Booking overlaps with an existing reservation', 409, details);
  }

  static accessDenied(message = 'Access denied by policy'): AppError {
    return new AppError('ACCESS_DENIED', message, 403);
  }

  static internal(message = 'Internal server error'): AppError {
    return new AppError('INTERNAL_ERROR', message, 500);
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
