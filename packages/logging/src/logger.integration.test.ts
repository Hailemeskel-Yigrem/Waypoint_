import { describe, it, expect, vi } from 'vitest';
import { createLogger } from './logger.js';
import { runWithCorrelation } from './correlation.js';

describe('logger integration', () => {
  it('writes JSON with correlation', () => {
    const lines: string[] = [];
    const logger = createLogger({ service: 'test' }, (l) => lines.push(l));
    runWithCorrelation({ correlationId: 'abc' }, () => {
      logger.info('hello', { foo: 1 });
    });
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0]!);
    expect(parsed.message).toBe('hello');
    expect(parsed.correlationId).toBe('abc');
  });
  it('child logger merges bindings', () => {
    const lines: string[] = [];
    const logger = createLogger({}, (l) => lines.push(l));
    logger.child({ orgId: 'o1' }).info('evt');
    const parsed = JSON.parse(lines[0]!);
    expect(parsed.meta.orgId).toBe('o1');
  });
});
