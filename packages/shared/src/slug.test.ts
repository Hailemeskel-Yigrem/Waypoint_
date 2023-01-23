import { describe, it, expect } from 'vitest';
import { slugify, isValidSlug, uniqueSlug } from '../utils/slug.js';

describe('slug', () => {
  it('slugifies text', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
  });
  it('validates slug', () => {
    expect(isValidSlug('hello-world')).toBe(true);
    expect(isValidSlug('Hello')).toBe(false);
  });
  it('unique slug', () => {
    const set = new Set(['test', 'test-2']);
    expect(uniqueSlug('Test', set)).toBe('test-3');
  });
});
