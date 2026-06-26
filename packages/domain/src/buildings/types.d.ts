export type BuildingStatus = 'active' | 'inactive' | 'archived' | 'draft';
export interface Building {
    id: string;
    organizationId: string;
    name: string;
    status: BuildingStatus;
    metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}
export interface CreateBuildingInput {
    organizationId: string;
    name: string;
    status?: BuildingStatus;
    metadata?: Record<string, unknown>;
}
export interface UpdateBuildingInput {
    name?: string;
    status?: BuildingStatus;
    metadata?: Record<string, unknown>;
    updatedAt?: string;
}
export interface BuildingFilter {
    organizationId: string;
    status?: BuildingStatus;
    query?: string;
    limit?: number;
    offset?: number;
}
//# sourceMappingURL=types.d.ts.map