export type FeatureFlagStatus = 'active' | 'inactive' | 'archived' | 'draft';

export interface FeatureFlag {
  id: string;
  organizationId: string;
  name: string;
  status: FeatureFlagStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureFlagInput {
  organizationId: string;
  name: string;
  status?: FeatureFlagStatus;
  metadata?: Record<string, unknown>;
}

export interface UpdateFeatureFlagInput {
  name?: string;
  status?: FeatureFlagStatus;
  metadata?: Record<string, unknown>;
  updatedAt?: string;
}

export interface FeatureFlagFilter {
  organizationId: string;
  status?: FeatureFlagStatus;
  query?: string;
  limit?: number;
  offset?: number;
}
