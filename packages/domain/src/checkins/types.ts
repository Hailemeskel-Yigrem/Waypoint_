export type CheckInStatus = 'active' | 'inactive' | 'archived' | 'draft';

export interface CheckIn {
  id: string;
  organizationId: string;
  name: string;
  status: CheckInStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCheckInInput {
  organizationId: string;
  name: string;
  status?: CheckInStatus;
  metadata?: Record<string, unknown>;
}

export interface UpdateCheckInInput {
  name?: string;
  status?: CheckInStatus;
  metadata?: Record<string, unknown>;
  updatedAt?: string;
}

export interface CheckInFilter {
  organizationId: string;
  status?: CheckInStatus;
  query?: string;
  limit?: number;
  offset?: number;
}
