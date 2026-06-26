export type TeamStatus = 'active' | 'inactive' | 'archived' | 'draft';
export interface Team {
    id: string;
    organizationId: string;
    name: string;
    status: TeamStatus;
    metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}
export interface CreateTeamInput {
    organizationId: string;
    name: string;
    status?: TeamStatus;
    metadata?: Record<string, unknown>;
}
export interface UpdateTeamInput {
    name?: string;
    status?: TeamStatus;
    metadata?: Record<string, unknown>;
    updatedAt?: string;
}
export interface TeamFilter {
    organizationId: string;
    status?: TeamStatus;
    query?: string;
    limit?: number;
    offset?: number;
}
//# sourceMappingURL=types.d.ts.map