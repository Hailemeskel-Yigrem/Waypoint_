import { describe, it, expect } from 'vitest';
import { api.test.tsEnvSchema, api.test.tsDefaults } from './api.test.ts.js';
describe('api-env.test.ts', () => {
  it('schema exists', () => expect(api.test.tsEnvSchema).toBeDefined());
  it('has defaults', () => expect(api.test.tsDefaults).toBeDefined());
});
