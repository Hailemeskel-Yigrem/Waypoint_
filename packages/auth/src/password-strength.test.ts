import { describe, it, expect } from 'vitest';
import { validatePasswordStrength } from './password.js';

describe('validatePasswordStrength', () => {
  it('rejects missing uppercase letters', () => {
    expect(validatePasswordStrength('lowercase1').ok).toBe(false);
  });

  it('rejects missing digits', () => {
    expect(validatePasswordStrength('NoDigitsHere').ok).toBe(false);
  });

  it('accepts a strong password', () => {
    const result = validatePasswordStrength('StrongPass9');
    expect(result.ok).toBe(true);
  });
});
