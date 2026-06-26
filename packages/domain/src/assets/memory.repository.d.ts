import type { Asset, CreateAssetInput, UpdateAssetInput, AssetFilter } from './types.js';
import type { AssetRepository } from './repository.js';
export declare class MemoryAssetRepository implements AssetRepository {
    private readonly rows;
    private key;
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
//# sourceMappingURL=memory.repository.d.ts.map