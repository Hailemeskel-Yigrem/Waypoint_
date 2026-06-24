import { describe, expect, it } from 'vitest';
import { evaluateAccessCase, evaluateAllAccessCases } from './evaluator.js';

const memberClaim = {
  organizationId: 'org-1',
  principalId: 'user-1',
  role: 'member' as const,
  action: 'desk:claim',
  resourceType: 'desk',
};

describe('access evaluator', () => {
  it('allows a member desk claim below the case limit', () => {
    expect(evaluateAccessCase({ ...memberClaim, attributes: { claimsToday: 0 } }, 1)).toEqual({
      allowed: true,
      reasons: [],
      caseId: 1,
    });
  });

  it('enforces case-specific desk claim limits', () => {
    const all = evaluateAllAccessCases({ ...memberClaim, attributes: { claimsToday: 1 } });

    expect(all).toHaveLength(30);
    expect(all[1]!.allowed).toBe(true);
    expect(all[2]).toMatchObject({
      allowed: false,
      reasons: ['daily desk claim limit reached'],
      caseId: 3,
    });
  });

  it('denies unknown actions instead of relying on an unreachable rank', () => {
    expect(
      evaluateAccessCase({ ...memberClaim, role: 'owner', action: 'unknown:action' }, 1),
    ).toMatchObject({ allowed: false, reasons: ['unknown action'] });
  });
});
