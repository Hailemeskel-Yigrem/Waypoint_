import { describe, it, expect } from 'vitest';
import * as mod from './proration.js';

describe('billing/proration', () => {
  it('exports callable members', () => {
    expect(mod).toBeTruthy();
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
