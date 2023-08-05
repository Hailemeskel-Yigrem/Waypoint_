export type ResourceStatus = 'active' | 'inactive' | 'archived' | 'draft';

export interface Resource {
  id: string;
  organizationId: string;
  name: string;
  status: ResourceStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourceInput {
  organizationId: string;
  name: string;
  status?: ResourceStatus;
  metadata?: Record<string, unknown>;
}

export interface UpdateResourceInput {
  name?: string;
  status?: ResourceStatus;
  metadata?: Record<string, unknown>;
  updatedAt?: string;
}

export interface ResourceFilter {
  organizationId: string;
  status?: ResourceStatus;
  query?: string;
  limit?: number;
  offset?: number;
}
