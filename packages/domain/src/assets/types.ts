export type AssetStatus = 'active' | 'inactive' | 'archived' | 'draft';

export interface Asset {
  id: string;
  organizationId: string;
  name: string;
  status: AssetStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssetInput {
  organizationId: string;
  name: string;
  status?: AssetStatus;
  metadata?: Record<string, unknown>;
}

export interface UpdateAssetInput {
  name?: string;
  status?: AssetStatus;
  metadata?: Record<string, unknown>;
  updatedAt?: string;
}

export interface AssetFilter {
  organizationId: string;
  status?: AssetStatus;
  query?: string;
  limit?: number;
  offset?: number;
}
