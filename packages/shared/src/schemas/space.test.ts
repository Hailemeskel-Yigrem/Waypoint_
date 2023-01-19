import { describe, it, expect } from 'vitest';
import * as schemas from './space.js';

describe('space schema', () => {
  it('exports schemas', () => {
    expect(Object.keys(schemas).length).toBeGreaterThan(0);
  });
});
