import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, validatePasswordStrength } from './password.js';

describe('password', () => {
  it('hashes and verifies', async () => {
    const hash = await hashPassword('Secret123');
    expect(await verifyPassword('Secret123', hash)).toBe(true);
    expect(await verifyPassword('wrong', hash)).toBe(false);
  }, 15_000);
  it('validates strength', () => {
    expect(validatePasswordStrength('short').ok).toBe(false);
    expect(validatePasswordStrength('ValidPass1').ok).toBe(true);
  });
});
