import { type Result } from '../result.js';
import type { Zone, CreateZoneInput, UpdateZoneInput, ZoneFilter } from './types.js';
import type { ZoneRepository } from './repository.js';
export declare class ZoneService {
    private readonly repo;
    constructor(repo: ZoneRepository);
    create(input: CreateZoneInput): Promise<Result<Zone, Error>>;
    get(organizationId: string, id: string): Promise<Result<Zone, Error>>;
    list(filter: ZoneFilter): Promise<Result<Zone[], Error>>;
    update(organizationId: string, id: string, input: UpdateZoneInput, actorRole: string): Promise<Result<Zone, Error>>;
    archive(organizationId: string, id: string, actorRole: string): Promise<Result<Zone, Error>>;
}
//# sourceMappingURL=service.d.ts.map