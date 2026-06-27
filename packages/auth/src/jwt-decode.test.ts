import { describe, it, expect } from 'vitest';
import { decodeToken, issueToken } from './jwt.js';

describe('decodeToken', () => {
  const secret = 'test-secret-key-with-enough-length!!';
  const user = { id: 'u1', orgId: 'o1', email: 'a@b.com', role: 'member' as const };

  it('decodes a valid token without verifying signature', () => {
    const token = issueToken(user, { secret });
    const payload = decodeToken(token);
    expect(payload?.sub).toBe('u1');
    expect(payload?.email).toBe('a@b.com');
  });

  it('returns null for malformed tokens', () => {
    expect(decodeToken('not-a-jwt')).toBeNull();
  });
});
