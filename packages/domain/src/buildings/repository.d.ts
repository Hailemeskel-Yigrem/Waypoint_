import type { Building, CreateBuildingInput, UpdateBuildingInput, BuildingFilter } from './types.js';
export interface BuildingRepository {
    create(input: CreateBuildingInput & {
        status: string;
        createdAt: string;
        updatedAt: string;
    }): Promise<Building>;
    findById(organizationId: string, id: string): Promise<Building | null>;
    findByName(organizationId: string, name: string): Promise<Building | null>;
    list(filter: BuildingFilter): Promise<Building[]>;
    update(organizationId: string, id: string, input: UpdateBuildingInput): Promise<Building>;
}
//# sourceMappingURL=repository.d.ts.map