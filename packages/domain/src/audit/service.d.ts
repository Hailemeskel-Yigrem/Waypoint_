import { type Result } from '../result.js';
import type { AuditEvent, CreateAuditEventInput, UpdateAuditEventInput, AuditEventFilter } from './types.js';
import type { AuditEventRepository } from './repository.js';
export declare class AuditEventService {
    private readonly repo;
    constructor(repo: AuditEventRepository);
    create(input: CreateAuditEventInput): Promise<Result<AuditEvent, Error>>;
    get(organizationId: string, id: string): Promise<Result<AuditEvent, Error>>;
    list(filter: AuditEventFilter): Promise<Result<AuditEvent[], Error>>;
    update(organizationId: string, id: string, input: UpdateAuditEventInput, actorRole: string): Promise<Result<AuditEvent, Error>>;
    archive(organizationId: string, id: string, actorRole: string): Promise<Result<AuditEvent, Error>>;
}
//# sourceMappingURL=service.d.ts.map