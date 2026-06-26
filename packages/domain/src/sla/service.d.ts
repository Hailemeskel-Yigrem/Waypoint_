import { type Result } from '../result.js';
import type { SlaTarget, CreateSlaTargetInput, UpdateSlaTargetInput, SlaTargetFilter } from './types.js';
import type { SlaTargetRepository } from './repository.js';
export declare class SlaTargetService {
    private readonly repo;
    constructor(repo: SlaTargetRepository);
    create(input: CreateSlaTargetInput): Promise<Result<SlaTarget, Error>>;
    get(organizationId: string, id: string): Promise<Result<SlaTarget, Error>>;
    list(filter: SlaTargetFilter): Promise<Result<SlaTarget[], Error>>;
    update(organizationId: string, id: string, input: UpdateSlaTargetInput, actorRole: string): Promise<Result<SlaTarget, Error>>;
    archive(organizationId: string, id: string, actorRole: string): Promise<Result<SlaTarget, Error>>;
}
//# sourceMappingURL=service.d.ts.map