import { AppError } from './errors.js';

export type Ok<T> = { ok: true; value: T };
export type Err = { ok: false; error: AppError };
export type Result<T> = Ok<T> | Err;

export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

export function err(error: AppError): Err {
  return { ok: false, error };
}

export function unwrap<T>(result: Result<T>): T {
  if (!result.ok) {
    throw result.error;
  }
  return result.value;
}

export async function fromPromise<T>(
  promise: Promise<T>,
  mapError: (e: unknown) => AppError,
): Promise<Result<T>> {
  try {
    return ok(await promise);
  } catch (e) {
    return err(mapError(e));
  }
}

export function mapResult<T, U>(result: Result<T>, fn: (value: T) => U): Result<U> {
  if (!result.ok) {
    return result;
  }
  return ok(fn(result.value));
}

export function flatMapResult<T, U>(result: Result<T>, fn: (value: T) => Result<U>): Result<U> {
  if (!result.ok) {
    return result;
  }
  return fn(result.value);
}
