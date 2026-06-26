import type { Policy, CreatePolicyInput, UpdatePolicyInput, PolicyFilter } from './types.js';
import type { PolicyRepository } from './repository.js';
export declare class MemoryPolicyRepository implements PolicyRepository {
    private readonly rows;
    private key;
    create(input: CreatePolicyInput & {
        status: string;
        createdAt: string;
        updatedAt: string;
    }): Promise<Policy>;
    findById(organizationId: string, id: string): Promise<Policy | null>;
    findByName(organizationId: string, name: string): Promise<Policy | null>;
    list(filter: PolicyFilter): Promise<Policy[]>;
    update(organizationId: string, id: string, input: UpdatePolicyInput): Promise<Policy>;
}
//# sourceMappingURL=memory.repository.d.ts.map