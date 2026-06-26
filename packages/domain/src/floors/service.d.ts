import { type Result } from '../result.js';
import type { Floor, CreateFloorInput, UpdateFloorInput, FloorFilter } from './types.js';
import type { FloorRepository } from './repository.js';
export declare class FloorService {
    private readonly repo;
    constructor(repo: FloorRepository);
    create(input: CreateFloorInput): Promise<Result<Floor, Error>>;
    get(organizationId: string, id: string): Promise<Result<Floor, Error>>;
    list(filter: FloorFilter): Promise<Result<Floor[], Error>>;
    update(organizationId: string, id: string, input: UpdateFloorInput, actorRole: string): Promise<Result<Floor, Error>>;
    archive(organizationId: string, id: string, actorRole: string): Promise<Result<Floor, Error>>;
}
//# sourceMappingURL=service.d.ts.map