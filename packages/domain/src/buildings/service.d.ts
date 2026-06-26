import { type Result } from '../result.js';
import type { Building, CreateBuildingInput, UpdateBuildingInput, BuildingFilter } from './types.js';
import type { BuildingRepository } from './repository.js';
export declare class BuildingService {
    private readonly repo;
    constructor(repo: BuildingRepository);
    create(input: CreateBuildingInput): Promise<Result<Building, Error>>;
    get(organizationId: string, id: string): Promise<Result<Building, Error>>;
    list(filter: BuildingFilter): Promise<Result<Building[], Error>>;
    update(organizationId: string, id: string, input: UpdateBuildingInput, actorRole: string): Promise<Result<Building, Error>>;
    archive(organizationId: string, id: string, actorRole: string): Promise<Result<Building, Error>>;
}
//# sourceMappingURL=service.d.ts.map