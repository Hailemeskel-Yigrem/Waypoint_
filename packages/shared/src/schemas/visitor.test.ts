import { describe, it, expect } from 'vitest';
import * as schemas from './visitor.js';

describe('visitor schema', () => {
  it('exports schemas', () => {
    expect(Object.keys(schemas).length).toBeGreaterThan(0);
  });
});
