import type { Zone, CreateZoneInput, UpdateZoneInput, ZoneFilter } from './types.js';
import type { ZoneRepository } from './repository.js';
export declare class MemoryZoneRepository implements ZoneRepository {
    private readonly rows;
    private key;
    create(input: CreateZoneInput & {
        status: string;
        createdAt: string;
        updatedAt: string;
    }): Promise<Zone>;
    findById(organizationId: string, id: string): Promise<Zone | null>;
    findByName(organizationId: string, name: string): Promise<Zone | null>;
    list(filter: ZoneFilter): Promise<Zone[]>;
    update(organizationId: string, id: string, input: UpdateZoneInput): Promise<Zone>;
}
//# sourceMappingURL=memory.repository.d.ts.map