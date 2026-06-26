import { type Result } from '../result.js';
import type { Asset, CreateAssetInput, UpdateAssetInput, AssetFilter } from './types.js';
import type { AssetRepository } from './repository.js';
export declare class AssetService {
    private readonly repo;
    constructor(repo: AssetRepository);
    create(input: CreateAssetInput): Promise<Result<Asset, Error>>;
    get(organizationId: string, id: string): Promise<Result<Asset, Error>>;
    list(filter: AssetFilter): Promise<Result<Asset[], Error>>;
    update(organizationId: string, id: string, input: UpdateAssetInput, actorRole: string): Promise<Result<Asset, Error>>;
    archive(organizationId: string, id: string, actorRole: string): Promise<Result<Asset, Error>>;
}
//# sourceMappingURL=service.d.ts.map