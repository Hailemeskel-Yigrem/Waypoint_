import { describe, it, expect } from 'vitest';
import { issueToken, verifyToken, payloadToSessionUser } from './jwt.js';

describe('jwt', () => {
  const secret = 'test-secret-key-with-enough-length!!';
  const user = { id: 'u1', orgId: 'o1', email: 'a@b.com', role: 'member' as const };

  it('issues and verifies', () => {
    const token = issueToken(user, { secret, expiresIn: '1h' });
    const payload = verifyToken(token, secret);
    expect(payload.sub).toBe('u1');
    expect(payloadToSessionUser(payload).email).toBe('a@b.com');
  });
});
