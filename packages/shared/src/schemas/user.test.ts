import { describe, it, expect } from 'vitest';
import * as schemas from './user.js';

describe('user schema', () => {
  it('exports schemas', () => {
    expect(Object.keys(schemas).length).toBeGreaterThan(0);
  });
});
