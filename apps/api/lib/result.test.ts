import { describe, it, expect } from 'vitest';
import { ok, err, unwrap, mapResult, flatMapResult } from '../../src/lib/result.js';
import { AppError } from '../../src/lib/errors.js';

describe('Result', () => {
  it('unwraps ok values', () => {
    expect(unwrap(ok(42))).toBe(42);
  });

  it('throws on err', () => {
    expect(() => unwrap(err(AppError.notFound('X')))).toThrow();
  });

  it('maps ok values', () => {
    expect(mapResult(ok(2), (n) => n * 2)).toEqual(ok(4));
  });

  it('short-circuits on err in flatMap', () => {
    const result = flatMapResult(ok(1), () => err(AppError.conflict('nope')));
    expect(result.ok).toBe(false);
  });
});

