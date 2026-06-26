import { type Result } from '../result.js';
import type { Policy, CreatePolicyInput, UpdatePolicyInput, PolicyFilter } from './types.js';
import type { PolicyRepository } from './repository.js';
export declare class PolicyService {
    private readonly repo;
    constructor(repo: PolicyRepository);
    create(input: CreatePolicyInput): Promise<Result<Policy, Error>>;
    get(organizationId: string, id: string): Promise<Result<Policy, Error>>;
    list(filter: PolicyFilter): Promise<Result<Policy[], Error>>;
    update(organizationId: string, id: string, input: UpdatePolicyInput, actorRole: string): Promise<Result<Policy, Error>>;
    archive(organizationId: string, id: string, actorRole: string): Promise<Result<Policy, Error>>;
}
//# sourceMappingURL=service.d.ts.map