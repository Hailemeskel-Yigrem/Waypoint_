import { describe, it, expect } from 'vitest';
import * as mod from './logger.js';

describe('logger', () => {
  it('module exports', () => {
    expect(mod).toBeDefined();
  });
});
