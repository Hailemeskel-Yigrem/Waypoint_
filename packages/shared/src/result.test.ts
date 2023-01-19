import { describe, it, expect } from 'vitest';
import { ok, err, isOk, isErr, unwrap, mapResult, flatMapResult } from '../result.js';

describe('result', () => {
  it('ok creates success', () => {
    expect(ok(42)).toEqual({ ok: true, value: 42 });
  });
  it('err creates failure', () => {
    expect(err('fail')).toEqual({ ok: false, error: 'fail' });
  });
  it('unwrap returns value', () => {
    expect(unwrap(ok('x'))).toBe('x');
  });
  it('unwrap throws on err', () => {
    expect(() => unwrap(err(new Error('e')))).toThrow('e');
  });
  it('mapResult transforms ok', () => {
    expect(mapResult(ok(2), (n) => n * 2)).toEqual({ ok: true, value: 4 });
  });
  it('flatMapResult chains', () => {
    const r = flatMapResult(ok(2), (n) => (n > 0 ? ok(n + 1) : err('bad')));
    expect(r).toEqual({ ok: true, value: 3 });
  });
  it('isOk/isErr', () => {
    expect(isOk(ok(1))).toBe(true);
    expect(isErr(err(1))).toBe(true);
  });
});
