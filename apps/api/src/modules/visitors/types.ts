import type { Timestamps, TenantScoped, VisitorStatus } from '../../lib/types.js';

export interface Visitor extends Timestamps, TenantScoped {
  id: string;
  hostUserId: string;
  name: string;
  email: string | null;
  company: string | null;
  expectedArrival: Date;
  checkInWindowStart: Date;
  checkInWindowEnd: Date;
  checkedInAt: Date | null;
  checkedOutAt: Date | null;
  status: VisitorStatus;
  badgeCode: string | null;
}

export interface CreateVisitorInput {
  organizationId: string;
  hostUserId: string;
  name: string;
  email?: string | null;
  company?: string | null;
  expectedArrival: Date;
  checkInWindowMinutes?: number;
}

export interface UpdateVisitorInput {
  name?: string;
  email?: string | null;
  company?: string | null;
  expectedArrival?: Date;
  status?: VisitorStatus;
  checkedInAt?: Date | null;
  checkedOutAt?: Date | null;
  badgeCode?: string | null;
}
