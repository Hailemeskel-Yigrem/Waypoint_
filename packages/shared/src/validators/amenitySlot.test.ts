import { describe, it, expect } from 'vitest';
import { validateAmenitySlot, assertValidAmenitySlot } from './amenitySlot.js';

describe('validator amenitySlot', () => {
  it('accepts a valid window', () => {
    const issues = validateAmenitySlot({
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
      assertValidAmenitySlot({
        start: '2024-05-01T12:00:00Z',
        end: '2024-05-01T11:00:00Z',
      }),
    ).toThrow(/end/);
  });
});
