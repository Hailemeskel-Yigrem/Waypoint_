export type PolicyStatus = 'active' | 'inactive' | 'archived' | 'draft';

export interface Policy {
  id: string;
  organizationId: string;
  name: string;
  status: PolicyStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePolicyInput {
  organizationId: string;
  name: string;
  status?: PolicyStatus;
  metadata?: Record<string, unknown>;
}

export interface UpdatePolicyInput {
  name?: string;
  status?: PolicyStatus;
  metadata?: Record<string, unknown>;
  updatedAt?: string;
}

export interface PolicyFilter {
  organizationId: string;
  status?: PolicyStatus;
  query?: string;
  limit?: number;
  offset?: number;
}
