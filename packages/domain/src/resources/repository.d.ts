import type { Resource, CreateResourceInput, UpdateResourceInput, ResourceFilter } from './types.js';
export interface ResourceRepository {
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
//# sourceMappingURL=repository.d.ts.map