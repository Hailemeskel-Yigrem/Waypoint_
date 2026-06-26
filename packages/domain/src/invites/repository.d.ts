import type { Invite, CreateInviteInput, UpdateInviteInput, InviteFilter } from './types.js';
export interface InviteRepository {
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
//# sourceMappingURL=repository.d.ts.map