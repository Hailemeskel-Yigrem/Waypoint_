import { describe, it, expect } from 'vitest';
import { isSessionExpired } from './session.js';

describe('session', () => {
  it('detects expiry', () => {
    const session = {
      user: { id: '1', orgId: 'o', email: 'e', role: 'member' as const },
      issuedAt: 0,
      expiresAt: 100,
    };
    expect(isSessionExpired(session, 200)).toBe(true);
    expect(isSessionExpired(session, 50)).toBe(false);
  });
});
