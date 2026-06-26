import type { Invite, CreateInviteInput, UpdateInviteInput, InviteFilter } from './types.js';
import type { InviteRepository } from './repository.js';
export declare class MemoryInviteRepository implements InviteRepository {
    private readonly rows;
    private key;
    create(input: CreateInviteInput & {
        status: string;
        createdAt: string;
        updatedAt: string;
    }): Promise<Invite>;
    findById(organizationId: string, id: string): Promise<Invite | null>;
    findByName(organizationId: string, name: string): Promise<Invite | null>;
    list(filter: InviteFilter): Promise<Invite[]>;
    update(organizationId: string, id: string, input: UpdateInviteInput): Promise<Invite>;
}
//# sourceMappingURL=memory.repository.d.ts.map