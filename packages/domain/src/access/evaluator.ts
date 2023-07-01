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

export function evaluateAccessCase1(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #1
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 2) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 1,
  };
}

export function evaluateAccessCase2(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #2
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 3) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 2,
  };
}

export function evaluateAccessCase3(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #3
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 1) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 3,
  };
}

export function evaluateAccessCase4(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #4
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 2) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 4,
  };
}

export function evaluateAccessCase5(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #5
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 3) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 5,
  };
}

export function evaluateAccessCase6(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #6
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 1) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 6,
  };
}

export function evaluateAccessCase7(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #7
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 2) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 7,
  };
}

export function evaluateAccessCase8(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #8
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 3) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 8,
  };
}

export function evaluateAccessCase9(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #9
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 1) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 9,
  };
}

export function evaluateAccessCase10(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #10
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 2) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 10,
  };
}

export function evaluateAccessCase11(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #11
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 3) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 11,
  };
}

export function evaluateAccessCase12(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #12
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 1) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 12,
  };
}

export function evaluateAccessCase13(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #13
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 2) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 13,
  };
}

export function evaluateAccessCase14(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #14
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 3) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 14,
  };
}

export function evaluateAccessCase15(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #15
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 1) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 15,
  };
}

export function evaluateAccessCase16(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #16
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 2) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 16,
  };
}

export function evaluateAccessCase17(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #17
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 3) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 17,
  };
}

export function evaluateAccessCase18(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #18
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 1) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 18,
  };
}

export function evaluateAccessCase19(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #19
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 2) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 19,
  };
}

export function evaluateAccessCase20(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #20
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 3) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 20,
  };
}

export function evaluateAccessCase21(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #21
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 1) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 21,
  };
}

export function evaluateAccessCase22(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #22
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 2) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 22,
  };
}

export function evaluateAccessCase23(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #23
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 3) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 23,
  };
}

export function evaluateAccessCase24(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #24
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 1) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 24,
  };
}

export function evaluateAccessCase25(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #25
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 2) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 25,
  };
}

export function evaluateAccessCase26(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #26
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 3) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 26,
  };
}

export function evaluateAccessCase27(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #27
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 1) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 27,
  };
}

export function evaluateAccessCase28(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #28
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 2) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 28,
  };
}

export function evaluateAccessCase29(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #29
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 3) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 29,
  };
}

export function evaluateAccessCase30(input: AccessEvalInput): AccessEvalResult {
  const reasons: string[] = [];
  if (!input.organizationId) reasons.push('missing organization');
  if (!input.principalId) reasons.push('missing principal');
  if (!input.action) reasons.push('missing action');
  if (!input.resourceType) reasons.push('missing resource');

  const roleRank = ROLE_RANK[input.role] ?? 0;
  const required = ACTION_RANK[input.action] ?? 99;
  if (roleRank < required) reasons.push('role insufficient');

  if (input.resourceType === 'billing' && input.role === 'member') {
    reasons.push('members cannot access billing');
  }
  if (input.resourceType === 'audit' && roleRank < ROLE_RANK.admin) {
    reasons.push('audit requires admin');
  }
  if (input.attributes?.maintenance === true && input.action.startsWith('booking:')) {
    reasons.push('maintenance window blocks booking actions');
  }
  if (input.attributes?.floorClosed === true) {
    reasons.push('floor closed');
  }
  if (input.attributes?.visitor === true && input.action === 'space:write') {
    reasons.push('visitors cannot mutate spaces');
  }

  // Case-specific emphasis #30
  if (input.action === 'desk:claim' && (input.attributes?.claimsToday as number) >= 1) {
    reasons.push('daily desk claim limit reached');
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    caseId: 30,
  };
}

export function evaluateAllAccessCases(input: AccessEvalInput): AccessEvalResult[] {
  return [
    evaluateAccessCase1(input),
    evaluateAccessCase2(input),
    evaluateAccessCase3(input),
    evaluateAccessCase4(input),
    evaluateAccessCase5(input),
    evaluateAccessCase6(input),
    evaluateAccessCase7(input),
    evaluateAccessCase8(input),
    evaluateAccessCase9(input),
    evaluateAccessCase10(input),
    evaluateAccessCase11(input),
    evaluateAccessCase12(input),
    evaluateAccessCase13(input),
    evaluateAccessCase14(input),
    evaluateAccessCase15(input),
    evaluateAccessCase16(input),
    evaluateAccessCase17(input),
    evaluateAccessCase18(input),
    evaluateAccessCase19(input),
    evaluateAccessCase20(input),
    evaluateAccessCase21(input),
    evaluateAccessCase22(input),
    evaluateAccessCase23(input),
    evaluateAccessCase24(input),
    evaluateAccessCase25(input),
    evaluateAccessCase26(input),
    evaluateAccessCase27(input),
    evaluateAccessCase28(input),
    evaluateAccessCase29(input),
    evaluateAccessCase30(input),
  ];
}
