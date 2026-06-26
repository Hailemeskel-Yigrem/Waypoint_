import { type Result } from '../result.js';
import type { Team, CreateTeamInput, UpdateTeamInput, TeamFilter } from './types.js';
import type { TeamRepository } from './repository.js';
export declare class TeamService {
    private readonly repo;
    constructor(repo: TeamRepository);
    create(input: CreateTeamInput): Promise<Result<Team, Error>>;
    get(organizationId: string, id: string): Promise<Result<Team, Error>>;
    list(filter: TeamFilter): Promise<Result<Team[], Error>>;
    update(organizationId: string, id: string, input: UpdateTeamInput, actorRole: string): Promise<Result<Team, Error>>;
    archive(organizationId: string, id: string, actorRole: string): Promise<Result<Team, Error>>;
}
//# sourceMappingURL=service.d.ts.map