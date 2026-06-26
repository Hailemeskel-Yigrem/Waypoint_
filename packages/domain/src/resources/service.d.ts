import { type Result } from '../result.js';
import type { Resource, CreateResourceInput, UpdateResourceInput, ResourceFilter } from './types.js';
import type { ResourceRepository } from './repository.js';
export declare class ResourceService {
    private readonly repo;
    constructor(repo: ResourceRepository);
    create(input: CreateResourceInput): Promise<Result<Resource, Error>>;
    get(organizationId: string, id: string): Promise<Result<Resource, Error>>;
    list(filter: ResourceFilter): Promise<Result<Resource[], Error>>;
    update(organizationId: string, id: string, input: UpdateResourceInput, actorRole: string): Promise<Result<Resource, Error>>;
    archive(organizationId: string, id: string, actorRole: string): Promise<Result<Resource, Error>>;
}
//# sourceMappingURL=service.d.ts.map