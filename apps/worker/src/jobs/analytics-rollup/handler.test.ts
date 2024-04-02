import { describe, it, expect, vi } from 'vitest';
import { createLogger } from '@waypoint/logging';

describe('analytics-rollup handler', () => {
  it('module loads', async () => {
    const mod = await import('./handler.js');
    expect(mod).toBeDefined();
  });
});
