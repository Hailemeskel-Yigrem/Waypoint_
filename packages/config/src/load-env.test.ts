import { describe, it, expect } from 'vitest';
import * as mod from './load-env.js';

describe('load-env', () => {
  it('exports', () => expect(mod).toBeDefined());
});
