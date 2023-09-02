export type SlaTargetStatus = 'active' | 'inactive' | 'archived' | 'draft';

export interface SlaTarget {
  id: string;
  organizationId: string;
  name: string;
  status: SlaTargetStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSlaTargetInput {
  organizationId: string;
  name: string;
  status?: SlaTargetStatus;
  metadata?: Record<string, unknown>;
}

export interface UpdateSlaTargetInput {
  name?: string;
  status?: SlaTargetStatus;
  metadata?: Record<string, unknown>;
  updatedAt?: string;
}

export interface SlaTargetFilter {
  organizationId: string;
  status?: SlaTargetStatus;
  query?: string;
  limit?: number;
  offset?: number;
}
