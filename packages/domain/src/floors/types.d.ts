export type FloorStatus = 'active' | 'inactive' | 'archived' | 'draft';
export interface Floor {
    id: string;
    organizationId: string;
    name: string;
    status: FloorStatus;
    metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}
export interface CreateFloorInput {
    organizationId: string;
    name: string;
    status?: FloorStatus;
    metadata?: Record<string, unknown>;
}
export interface UpdateFloorInput {
    name?: string;
    status?: FloorStatus;
    metadata?: Record<string, unknown>;
    updatedAt?: string;
}
export interface FloorFilter {
    organizationId: string;
    status?: FloorStatus;
    query?: string;
    limit?: number;
    offset?: number;
}
//# sourceMappingURL=types.d.ts.map