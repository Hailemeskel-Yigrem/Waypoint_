import { describe, it, expect, beforeEach } from 'vitest';
import { loadConfig, resetConfig } from '../../src/config/index.js';

describe('config', () => {
  beforeEach(() => resetConfig());

  it('loads defaults in test mode', () => {
    process.env.NODE_ENV = 'test';
    const config = loadConfig();
    expect(config.PORT).toBe(3000);
  });
});

