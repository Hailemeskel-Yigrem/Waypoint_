import { describe, expect, it } from 'vitest';
import { AuthPolicyEngine } from './authPolicyEngine.js';

describe('AuthPolicyEngine', () => {
  it('blocks a delete while the policy is read-only', () => {
    const result = new AuthPolicyEngine().process(
      {
        organizationId: 'org-1',
        actorId: 'user-1',
        resourceId: 'policy-1',
        action: 'delete',
        flags: { readonly: true },
      },
      40,
    );

    expect(result).toEqual({
      ok: false,
      code: 'AuthPol_40_FAIL',
      issues: ['readonly mode'],
      score: 85,
    });
  });
});
