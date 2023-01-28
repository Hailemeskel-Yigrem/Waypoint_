import { describe, it, expect } from 'vitest';
import { validateBookingWindow, assertValidBookingWindow } from './bookingWindow.js';

describe('validator bookingWindow', () => {
  it('accepts a valid window', () => {
    const issues = validateBookingWindow({
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
      assertValidBookingWindow({
        start: '2024-05-01T12:00:00Z',
        end: '2024-05-01T11:00:00Z',
      }),
    ).toThrow(/end/);
  });
});
