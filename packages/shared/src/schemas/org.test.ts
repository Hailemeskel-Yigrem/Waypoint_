import { describe, it, expect } from 'vitest';
import * as schemas from './org.js';

describe('org schema', () => {
  it('exports schemas', () => {
    expect(Object.keys(schemas).length).toBeGreaterThan(0);
  });
});
