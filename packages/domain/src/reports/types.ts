export type ReportStatus = 'active' | 'inactive' | 'archived' | 'draft';

export interface Report {
  id: string;
  organizationId: string;
  name: string;
  status: ReportStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportInput {
  organizationId: string;
  name: string;
  status?: ReportStatus;
  metadata?: Record<string, unknown>;
}

export interface UpdateReportInput {
  name?: string;
  status?: ReportStatus;
  metadata?: Record<string, unknown>;
  updatedAt?: string;
}

export interface ReportFilter {
  organizationId: string;
  status?: ReportStatus;
  query?: string;
  limit?: number;
  offset?: number;
}
