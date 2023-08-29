import type { Shift, CreateShiftInput, UpdateShiftInput, ShiftFilter } from './types.js';

export interface ShiftRepository {
  create(
    input: CreateShiftInput & { status: string; createdAt: string; updatedAt: string },
  ): Promise<Shift>;
  findById(organizationId: string, id: string): Promise<Shift | null>;
  findByName(organizationId: string, name: string): Promise<Shift | null>;
  list(filter: ShiftFilter): Promise<Shift[]>;
  update(organizationId: string, id: string, input: UpdateShiftInput): Promise<Shift>;
}
