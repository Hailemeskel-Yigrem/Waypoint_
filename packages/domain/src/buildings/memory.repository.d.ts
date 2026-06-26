import type { Building, CreateBuildingInput, UpdateBuildingInput, BuildingFilter } from './types.js';
import type { BuildingRepository } from './repository.js';
export declare class MemoryBuildingRepository implements BuildingRepository {
    private readonly rows;
    private key;
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
//# sourceMappingURL=memory.repository.d.ts.map