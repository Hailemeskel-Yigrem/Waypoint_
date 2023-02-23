import type { Timestamps, TenantScoped, UserRole } from '../../lib/types.js';

export type AccessAction = 'book_desk' | 'book_space' | 'enter_building' | 'manage_visitors';

export type AccessEffect = 'allow' | 'deny';

export interface AccessPolicy extends Timestamps, TenantScoped {
  id: string;
  name: string;
  action: AccessAction;
  effect: AccessEffect;
  priority: number;
  conditions: AccessConditions;
  isActive: boolean;
}

export interface AccessConditions {
  roles?: UserRole[];
  spaceIds?: string[];
  deskIds?: string[];
  daysOfWeek?: number[];
  startHour?: number;
  endHour?: number;
}

export interface CreateAccessPolicyInput {
  organizationId: string;
  name: string;
  action: AccessAction;
  effect: AccessEffect;
  priority?: number;
  conditions: AccessConditions;
}

export interface AccessEvaluationContext {
  organizationId: string;
  userId: string;
  userRole: UserRole;
  action: AccessAction;
  deskId?: string | null;
  spaceId?: string | null;
  at?: Date;
}
