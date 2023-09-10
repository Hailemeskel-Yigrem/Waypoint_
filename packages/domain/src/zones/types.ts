export type ZoneStatus = 'active' | 'inactive' | 'archived' | 'draft';

export interface Zone {
  id: string;
  organizationId: string;
  name: string;
  status: ZoneStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateZoneInput {
  organizationId: string;
  name: string;
  status?: ZoneStatus;
  metadata?: Record<string, unknown>;
}

export interface UpdateZoneInput {
  name?: string;
  status?: ZoneStatus;
  metadata?: Record<string, unknown>;
  updatedAt?: string;
}

export interface ZoneFilter {
  organizationId: string;
  status?: ZoneStatus;
  query?: string;
  limit?: number;
  offset?: number;
}
