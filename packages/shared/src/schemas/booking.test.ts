import { describe, it, expect } from 'vitest';
import * as schemas from './booking.js';

describe('booking schema', () => {
  it('exports schemas', () => {
    expect(Object.keys(schemas).length).toBeGreaterThan(0);
  });
});
