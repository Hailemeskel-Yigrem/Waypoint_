import { describe, it, expect } from 'vitest';
import * as mod from './worker.js';

describe('worker', () => {
  it('exports', () => expect(mod).toBeDefined());
});
