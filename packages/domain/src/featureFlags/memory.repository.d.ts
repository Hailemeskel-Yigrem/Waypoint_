import type { FeatureFlag, CreateFeatureFlagInput, UpdateFeatureFlagInput, FeatureFlagFilter } from './types.js';
import type { FeatureFlagRepository } from './repository.js';
export declare class MemoryFeatureFlagRepository implements FeatureFlagRepository {
    private readonly rows;
    private key;
    create(input: CreateFeatureFlagInput & {
        status: string;
        createdAt: string;
        updatedAt: string;
    }): Promise<FeatureFlag>;
    findById(organizationId: string, id: string): Promise<FeatureFlag | null>;
    findByName(organizationId: string, name: string): Promise<FeatureFlag | null>;
    list(filter: FeatureFlagFilter): Promise<FeatureFlag[]>;
    update(organizationId: string, id: string, input: UpdateFeatureFlagInput): Promise<FeatureFlag>;
}
//# sourceMappingURL=memory.repository.d.ts.map