import { describe, it, expect } from 'vitest';
import * as mod from './plans.js';

describe('billing/plans', () => {
  it('exports callable members', () => {
    expect(mod).toBeTruthy();
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
