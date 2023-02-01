import { describe, it, expect } from 'vitest';
import { validateSpaceCapacity, assertValidSpaceCapacity } from './spaceCapacity.js';

describe('validator spaceCapacity', () => {
  it('accepts a valid window', () => {
    const issues = validateSpaceCapacity({
      start: '2024-05-01T10:00:00Z',
      end: '2024-05-01T11:00:00Z',
      email: 'user@example.com',
      slug: 'acme-labs',
      url: 'https://hooks.example.com/x',
      capacity: 4,
    });
    expect(issues).toEqual([]);
  });

  it('rejects inverted ranges', () => {
    expect(() =>
      assertValidSpaceCapacity({
        start: '2024-05-01T12:00:00Z',
        end: '2024-05-01T11:00:00Z',
      }),
    ).toThrow(/end/);
  });
});
