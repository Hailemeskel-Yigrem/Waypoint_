import type { Floor, CreateFloorInput, UpdateFloorInput, FloorFilter } from './types.js';

export interface FloorRepository {
  create(
    input: CreateFloorInput & { status: string; createdAt: string; updatedAt: string },
  ): Promise<Floor>;
  findById(organizationId: string, id: string): Promise<Floor | null>;
  findByName(organizationId: string, name: string): Promise<Floor | null>;
  list(filter: FloorFilter): Promise<Floor[]>;
  update(organizationId: string, id: string, input: UpdateFloorInput): Promise<Floor>;
}
