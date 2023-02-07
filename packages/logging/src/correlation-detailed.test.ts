import { describe, it, expect } from 'vitest';
import { parseLogLevel, shouldLog, LogLevels } from './levels.js';
describe('correlation-detailed.test.ts', () => {
  it('parseLogLevel defaults', () => expect(parseLogLevel('unknown')).toBe('info'));
  it('shouldLog filters', () => expect(shouldLog(LogLevels.warn, LogLevels.info)).toBe(false));
});
