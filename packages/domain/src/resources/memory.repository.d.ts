import type { Resource, CreateResourceInput, UpdateResourceInput, ResourceFilter } from './types.js';
import type { ResourceRepository } from './repository.js';
export declare class MemoryResourceRepository implements ResourceRepository {
    private readonly rows;
    private key;
    create(input: CreateResourceInput & {
        status: string;
        createdAt: string;
        updatedAt: string;
    }): Promise<Resource>;
    findById(organizationId: string, id: string): Promise<Resource | null>;
    findByName(organizationId: string, name: string): Promise<Resource | null>;
    list(filter: ResourceFilter): Promise<Resource[]>;
    update(organizationId: string, id: string, input: UpdateResourceInput): Promise<Resource>;
}
//# sourceMappingURL=memory.repository.d.ts.map