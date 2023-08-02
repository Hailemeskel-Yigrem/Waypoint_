import { describe, it, expect } from 'vitest';
import { evaluatePolicies, type PolicyRule } from './engine.js';

const rules: PolicyRule[] = [
  {
    id: 'deny-billing',
    priority: 100,
    effect: 'deny',
    actions: ['billing:write'],
    resources: ['*'],
    roles: ['member'],
  },
  {
    id: 'allow-read',
    priority: 10,
    effect: 'allow',
    actions: ['space:read'],
    resources: ['space'],
    roles: ['member', 'admin'],
  },
  {
    id: 'admin-all',
    priority: 50,
    effect: 'allow',
    actions: ['*'],
    resources: ['*'],
    roles: ['admin'],
  },
];

describe('policy engine', () => {
  it('allows member space read', () => {
    const decision = evaluatePolicies(rules, {
      action: 'space:read',
      resource: 'space',
      role: 'member',
    });
    expect(decision.effect).toBe('allow');
  });

  it('denies member billing write via higher priority', () => {
    const decision = evaluatePolicies(rules, {
      action: 'billing:write',
      resource: 'invoice',
      role: 'member',
    });
    expect(decision.effect).toBe('deny');
    expect(decision.matchedRuleId).toBe('deny-billing');
  });

  it('defaults to deny', () => {
    const decision = evaluatePolicies([], { action: 'x', resource: 'y', role: 'member' });
    expect(decision.effect).toBe('deny');
  });
});
