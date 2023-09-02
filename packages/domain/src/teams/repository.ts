import type { Team, CreateTeamInput, UpdateTeamInput, TeamFilter } from './types.js';

export interface TeamRepository {
  create(
    input: CreateTeamInput & { status: string; createdAt: string; updatedAt: string },
  ): Promise<Team>;
  findById(organizationId: string, id: string): Promise<Team | null>;
  findByName(organizationId: string, name: string): Promise<Team | null>;
  list(filter: TeamFilter): Promise<Team[]>;
  update(organizationId: string, id: string, input: UpdateTeamInput): Promise<Team>;
}
