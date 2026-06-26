import type { SlaTarget, CreateSlaTargetInput, UpdateSlaTargetInput, SlaTargetFilter } from './types.js';
import type { SlaTargetRepository } from './repository.js';
export declare class MemorySlaTargetRepository implements SlaTargetRepository {
    private readonly rows;
    private key;
    create(input: CreateSlaTargetInput & {
        status: string;
        createdAt: string;
        updatedAt: string;
    }): Promise<SlaTarget>;
    findById(organizationId: string, id: string): Promise<SlaTarget | null>;
    findByName(organizationId: string, name: string): Promise<SlaTarget | null>;
    list(filter: SlaTargetFilter): Promise<SlaTarget[]>;
    update(organizationId: string, id: string, input: UpdateSlaTargetInput): Promise<SlaTarget>;
}
//# sourceMappingURL=memory.repository.d.ts.map