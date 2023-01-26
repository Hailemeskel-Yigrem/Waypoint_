import type { VisitorStatus } from '../constants/index.js';
import type { EntityId, OrgId, UserId } from './id.js';

export interface Visitor {
  id: EntityId;
  orgId: OrgId;
  hostUserId: UserId;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  expectedAt: string;
  expiresAt: string;
  status: VisitorStatus;
  checkedInAt?: string;
  checkedOutAt?: string;
}
