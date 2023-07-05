export type AuditEventStatus = 'active' | 'inactive' | 'archived' | 'draft';

export interface AuditEvent {
  id: string;
  organizationId: string;
  name: string;
  status: AuditEventStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAuditEventInput {
  organizationId: string;
  name: string;
  status?: AuditEventStatus;
  metadata?: Record<string, unknown>;
}

export interface UpdateAuditEventInput {
  name?: string;
  status?: AuditEventStatus;
  metadata?: Record<string, unknown>;
  updatedAt?: string;
}

export interface AuditEventFilter {
  organizationId: string;
  status?: AuditEventStatus;
  query?: string;
  limit?: number;
  offset?: number;
}
