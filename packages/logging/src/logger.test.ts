import { describe, it, expect, vi } from 'vitest';
import * as mod from './logger.js';

describe('logger', () => {
  it('module exports', () => {
    expect(mod).toBeDefined();
  });
});
