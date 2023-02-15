import { describe, it, expect } from 'vitest';
import { encodeJwt } from '../../src/middleware/auth.js';

describe('JWT encoding', () => {
  it('produces three-part token', () => {
    const token = encodeJwt({ userId: 'u1', organizationId: 'o1', role: 'admin', email: 'a@b.com' }, 'test-secret-16chars!!');
    expect(token.split('.')).toHaveLength(3);
  });
});

