import { describe, it, expect } from 'vitest';
import { extractBearerToken } from './middleware.js';

describe('middleware', () => {
  it('extracts bearer', () => {
    expect(extractBearerToken('Bearer abc')).toBe('abc');
    expect(extractBearerToken(undefined)).toBeNull();
  });
});
