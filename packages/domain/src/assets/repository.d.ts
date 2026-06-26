import type { Asset, CreateAssetInput, UpdateAssetInput, AssetFilter } from './types.js';
export interface AssetRepository {
    create(input: CreateAssetInput & {
        status: string;
        createdAt: string;
        updatedAt: string;
    }): Promise<Asset>;
    findById(organizationId: string, id: string): Promise<Asset | null>;
    findByName(organizationId: string, name: string): Promise<Asset | null>;
    list(filter: AssetFilter): Promise<Asset[]>;
    update(organizationId: string, id: string, input: UpdateAssetInput): Promise<Asset>;
}
//# sourceMappingURL=repository.d.ts.map