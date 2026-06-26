import { type Result } from '../result.js';
import type { Invite, CreateInviteInput, UpdateInviteInput, InviteFilter } from './types.js';
import type { InviteRepository } from './repository.js';
export declare class InviteService {
    private readonly repo;
    constructor(repo: InviteRepository);
    create(input: CreateInviteInput): Promise<Result<Invite, Error>>;
    get(organizationId: string, id: string): Promise<Result<Invite, Error>>;
    list(filter: InviteFilter): Promise<Result<Invite[], Error>>;
    update(organizationId: string, id: string, input: UpdateInviteInput, actorRole: string): Promise<Result<Invite, Error>>;
    archive(organizationId: string, id: string, actorRole: string): Promise<Result<Invite, Error>>;
}
//# sourceMappingURL=service.d.ts.map