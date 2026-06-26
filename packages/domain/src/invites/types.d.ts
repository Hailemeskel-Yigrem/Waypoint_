export type InviteStatus = 'active' | 'inactive' | 'archived' | 'draft';
export interface Invite {
    id: string;
    organizationId: string;
    name: string;
    status: InviteStatus;
    metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}
export interface CreateInviteInput {
    organizationId: string;
    name: string;
    status?: InviteStatus;
    metadata?: Record<string, unknown>;
}
export interface UpdateInviteInput {
    name?: string;
    status?: InviteStatus;
    metadata?: Record<string, unknown>;
    updatedAt?: string;
}
export interface InviteFilter {
    organizationId: string;
    status?: InviteStatus;
    query?: string;
    limit?: number;
    offset?: number;
}
//# sourceMappingURL=types.d.ts.map