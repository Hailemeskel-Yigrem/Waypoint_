import { describe, it, expect, vi } from 'vitest';
import { withRetry, SimpleCsv } from './csv.js';

describe('shared utils/csv', () => {
  it('retries failed operations', async () => {
    const fn = vi.fn().mockRejectedValueOnce(new Error('temp')).mockResolvedValueOnce('ok');
    await expect(withRetry(fn, { retries: 2, baseMs: 1 })).resolves.toBe('ok');
  });

  it('tracks breaker state', () => {
    const breaker = new SimpleCsv(2);
    breaker.recordFailure();
    expect(breaker.open).toBe(false);
    breaker.recordFailure();
    expect(breaker.open).toBe(true);
  });
});
