import type { Team, CreateTeamInput, UpdateTeamInput, TeamFilter } from './types.js';
import type { TeamRepository } from './repository.js';
export declare class MemoryTeamRepository implements TeamRepository {
    private readonly rows;
    private key;
    create(input: CreateTeamInput & {
        status: string;
        createdAt: string;
        updatedAt: string;
    }): Promise<Team>;
    findById(organizationId: string, id: string): Promise<Team | null>;
    findByName(organizationId: string, name: string): Promise<Team | null>;
    list(filter: TeamFilter): Promise<Team[]>;
    update(organizationId: string, id: string, input: UpdateTeamInput): Promise<Team>;
}
//# sourceMappingURL=memory.repository.d.ts.map