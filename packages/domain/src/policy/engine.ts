export type Effect = 'allow' | 'deny';

export interface PolicyRule {
  id: string;
  priority: number;
  effect: Effect;
  actions: string[];
  resources: string[];
  roles?: string[];
  conditions?: Record<string, string | number | boolean>;
}

export interface PolicyRequest {
  action: string;
  resource: string;
  role: string;
  attributes?: Record<string, string | number | boolean>;
}

export interface PolicyDecision {
  effect: Effect;
  matchedRuleId?: string;
  reason: string;
}

function matchValue(
  expected: string | number | boolean,
  actual: string | number | boolean | undefined,
): boolean {
  if (actual === undefined) return false;
  return expected === actual;
}

export function evaluatePolicies(rules: PolicyRule[], request: PolicyRequest): PolicyDecision {
  const sorted = [...rules].sort((a, b) => b.priority - a.priority);
  for (const rule of sorted) {
    const actionOk = rule.actions.includes('*') || rule.actions.includes(request.action);
    const resourceOk = rule.resources.includes('*') || rule.resources.includes(request.resource);
    const roleOk = !rule.roles || rule.roles.includes(request.role);
    const conditionsOk =
      !rule.conditions ||
      Object.entries(rule.conditions).every(([k, v]) => matchValue(v, request.attributes?.[k]));
    if (actionOk && resourceOk && roleOk && conditionsOk) {
      return {
        effect: rule.effect,
        matchedRuleId: rule.id,
        reason: `matched rule ${rule.id} with effect ${rule.effect}`,
      };
    }
  }
  return { effect: 'deny', reason: 'no matching policy rule (default deny)' };
}
