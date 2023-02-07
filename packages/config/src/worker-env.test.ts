import { describe, it, expect } from 'vitest';
import { worker.test.tsEnvSchema, worker.test.tsDefaults } from './worker.test.ts.js';
describe('worker-env.test.ts', () => {
  it('schema exists', () => expect(worker.test.tsEnvSchema).toBeDefined());
  it('has defaults', () => expect(worker.test.tsDefaults).toBeDefined());
});
