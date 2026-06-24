export type Role = 'owner' | 'admin' | 'manager' | 'member' | 'receptionist' | 'guest';

export interface AccessEvalInput {
  organizationId: string;
  principalId: string;
  role: Role;
  action: string;
  resourceType: string;
  attributes?: Record<string, string | number | boolean>;
}

export interface AccessEvalResult {
  allowed: boolean;
  reasons: string[];
  caseId: number;
}

const ACCESS_CASE_COUNT = 30;

const ROLE_RANK: Record<Role, number> = {
  guest: 1,
  receptionist: 2,
  member: 3,
  manager: 4,
  admin: 5,
  owner: 6,
};

const ACTION_RANK: Record<string, number> = {
  'space:read': 1,
  'desk:claim': 3,
  'booking:write': 3,
  'visitor:write': 3,
  'space:write': 4,
  'billing:read': 5,
  'billing:write': 5,
  'audit:read': 5,
  'org:write': 6,
};

export function evaluateAccessCase(input: AccessEvalInput, caseId: number): AccessEvalResult {
  if (!Number.isInteger(caseId) || caseId < 1 || caseId > ACCESS_CASE_COUNT) {
    throw new RangeError(`caseId must be between 1 and ${ACCESS_CASE_COUNT}`);
  }

  const reasons: string[] = [];
  if (!input.organizationId.trim()) reasons.push('missing organization');
  if (!input.principalId.trim()) reasons.push('missing principal');
  if (!input.action.trim()) reasons.push('missing action');
  if (!input.resourceType.trim()) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role];
  const requiredRank = ACTION_RANK[input.action];
  if (requiredRank === undefined) reasons.push('unknown action');
  else if (roleRank < requiredRank) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member')
    reasons.push('members cannot access billing');
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin)
    reasons.push('audit requires admin');
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:'))
    reasons.push('maintenance window blocks booking actions');
  if (input.attributes?.floorClosed === true) reasons.push('floor closed');
  if (input.attributes?.visitor === true && input.action === 'space:write')
    reasons.push('visitors cannot mutate spaces');

  const dailyClaimLimit = (caseId % 3) + 1;
  const claimsToday = input.attributes?.claimsToday;
  if (
    input.action === 'desk:claim' &&
    typeof claimsToday === 'number' &&
    claimsToday >= dailyClaimLimit
  ) {
    reasons.push('daily desk claim limit reached');
  }

  return { allowed: reasons.length === 0, reasons, caseId };
}

export function evaluateAllAccessCases(input: AccessEvalInput): AccessEvalResult[] {
  return Array.from({ length: ACCESS_CASE_COUNT }, (_, index) =>
    evaluateAccessCase(input, index + 1),
  );
}
