import { type Result } from '../result.js';
import type { FeatureFlag, CreateFeatureFlagInput, UpdateFeatureFlagInput, FeatureFlagFilter } from './types.js';
import type { FeatureFlagRepository } from './repository.js';
export declare class FeatureFlagService {
    private readonly repo;
    constructor(repo: FeatureFlagRepository);
    create(input: CreateFeatureFlagInput): Promise<Result<FeatureFlag, Error>>;
    get(organizationId: string, id: string): Promise<Result<FeatureFlag, Error>>;
    list(filter: FeatureFlagFilter): Promise<Result<FeatureFlag[], Error>>;
    update(organizationId: string, id: string, input: UpdateFeatureFlagInput, actorRole: string): Promise<Result<FeatureFlag, Error>>;
    archive(organizationId: string, id: string, actorRole: string): Promise<Result<FeatureFlag, Error>>;
}
//# sourceMappingURL=service.d.ts.map