import { describe, it, expect } from 'vitest';
import { AppError, isAppError } from '../../src/lib/errors.js';

describe('AppError', () => {
  it('creates validation errors with 400', () => {
    const err = AppError.validation('bad input', { field: 'name' });
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(isAppError(err)).toBe(true);
  });

  it('creates booking overlap errors', () => {
    const err = AppError.bookingOverlap({ id: 'b1' });
    expect(err.code).toBe('BOOKING_OVERLAP');
    expect(err.statusCode).toBe(409);
  });

  it('creates billing limit errors with 402', () => {
    const err = AppError.billingLimit('limit reached');
    expect(err.statusCode).toBe(402);
  });
});

