export type ShiftStatus = 'active' | 'inactive' | 'archived' | 'draft';
export interface Shift {
    id: string;
    organizationId: string;
    name: string;
    status: ShiftStatus;
    metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}
export interface CreateShiftInput {
    organizationId: string;
    name: string;
    status?: ShiftStatus;
    metadata?: Record<string, unknown>;
}
export interface UpdateShiftInput {
    name?: string;
    status?: ShiftStatus;
    metadata?: Record<string, unknown>;
    updatedAt?: string;
}
export interface ShiftFilter {
    organizationId: string;
    status?: ShiftStatus;
    query?: string;
    limit?: number;
    offset?: number;
}
//# sourceMappingURL=types.d.ts.map