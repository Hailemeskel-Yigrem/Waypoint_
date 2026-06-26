import type { FeatureFlag, CreateFeatureFlagInput, UpdateFeatureFlagInput, FeatureFlagFilter } from './types.js';
export interface FeatureFlagRepository {
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
//# sourceMappingURL=repository.d.ts.map