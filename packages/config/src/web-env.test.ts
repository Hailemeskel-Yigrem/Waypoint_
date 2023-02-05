import { describe, it, expect } from 'vitest';
import { web.test.tsEnvSchema, web.test.tsDefaults } from './web.test.ts.js';
describe('web-env.test.ts', () => {
  it('schema exists', () => expect(web.test.tsEnvSchema).toBeDefined());
  it('has defaults', () => expect(web.test.tsDefaults).toBeDefined());
});
