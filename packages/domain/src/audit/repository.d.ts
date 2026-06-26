import type { AuditEvent, CreateAuditEventInput, UpdateAuditEventInput, AuditEventFilter } from './types.js';
export interface AuditEventRepository {
    create(input: CreateAuditEventInput & {
        status: string;
        createdAt: string;
        updatedAt: string;
    }): Promise<AuditEvent>;
    findById(organizationId: string, id: string): Promise<AuditEvent | null>;
    findByName(organizationId: string, name: string): Promise<AuditEvent | null>;
    list(filter: AuditEventFilter): Promise<AuditEvent[]>;
    update(organizationId: string, id: string, input: UpdateAuditEventInput): Promise<AuditEvent>;
}
//# sourceMappingURL=repository.d.ts.map