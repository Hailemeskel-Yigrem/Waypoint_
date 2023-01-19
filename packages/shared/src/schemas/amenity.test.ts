import { describe, it, expect } from 'vitest';
import * as schemas from './amenity.js';

describe('amenity schema', () => {
  it('exports schemas', () => {
    expect(Object.keys(schemas).length).toBeGreaterThan(0);
  });
});
