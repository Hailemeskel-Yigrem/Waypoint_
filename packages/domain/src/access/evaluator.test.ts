import { describe, it, expect } from 'vitest';
import { evaluateAccessCase1, evaluateAllAccessCases } from './evaluator.js';

describe('access evaluator', () => {
  it('allows member desk claim under limit', () => {
    const result = evaluateAccessCase1({
      organizationId: 'org',
      principalId: 'u1',
      role: 'member',
      action: 'desk:claim',
      resourceType: 'desk',
      attributes: { claimsToday: 0 },
    });
    expect(result.allowed).toBe(true);
  });

  it('runs all cases', () => {
    const all = evaluateAllAccessCases({
      organizationId: 'org',
      principalId: 'u1',
      role: 'admin',
      action: 'space:read',
      resourceType: 'space',
    });
    expect(all).toHaveLength(30);
  });
});
