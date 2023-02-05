import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { loadEnv } from './load-env.js';

describe('loadEnv integration', () => {
  it('parses valid env', () => {
    const schema = z.object({ FOO: z.string().default('bar') });
    expect(loadEnv(schema, {})).toEqual({ FOO: 'bar' });
  });
  it('throws on invalid', () => {
    const schema = z.object({ PORT: z.coerce.number() });
    expect(() => loadEnv(schema, { PORT: 'abc' })).toThrow('Invalid environment');
  });
});
