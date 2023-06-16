import { describe, it, expect } from 'vitest';
import { AuthPolicyEngine } from './authPolicyEngine.js';

describe('AuthPolicyEngine', () => {
  it('runs', () => {
    const e = new AuthPolicyEngine();
    const r = e.runAll({ organizationId: 'o', actorId: 'a', resourceId: 'r', action: 'read' });
    expect(r).toHaveLength(40);
  });
});
