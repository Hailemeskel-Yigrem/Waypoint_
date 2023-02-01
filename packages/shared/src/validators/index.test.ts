import { describe, it, expect } from 'vitest';
import { validateUuid } from './index.js';

describe('validators', () => {
  it('validates uuid', () => {
    expect(validateUuid('11111111-1111-1111-1111-111111111111')).toBe(true);
    expect(validateUuid('bad')).toBe(false);
  });
});
