import type { UserRole } from '../constants/index.js';
import type { EntityId, OrgId } from './id.js';

export interface User {
  id: EntityId;
  orgId: OrgId;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  department?: string;
  title?: string;
  phone?: string;
}
