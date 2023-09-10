import type { Zone, CreateZoneInput, UpdateZoneInput, ZoneFilter } from './types.js';

export interface ZoneRepository {
  create(
    input: CreateZoneInput & { status: string; createdAt: string; updatedAt: string },
  ): Promise<Zone>;
  findById(organizationId: string, id: string): Promise<Zone | null>;
  findByName(organizationId: string, name: string): Promise<Zone | null>;
  list(filter: ZoneFilter): Promise<Zone[]>;
  update(organizationId: string, id: string, input: UpdateZoneInput): Promise<Zone>;
}
