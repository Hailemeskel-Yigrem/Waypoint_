import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, signPayload, verifySignature, generateToken } from '../../src/lib/crypto.js';

describe('crypto', () => {
  it('hashes and verifies passwords', () => {
    const hash = hashPassword('secret123');
    expect(verifyPassword('secret123', hash)).toBe(true);
    expect(verifyPassword('wrong', hash)).toBe(false);
  });

  it('signs and verifies payloads', () => {
    const sig = signPayload('payload', 'secret');
    expect(verifySignature('payload', sig, 'secret')).toBe(true);
  });

  it('generates tokens', () => {
    expect(generateToken()).toHaveLength(43);
  });
});

