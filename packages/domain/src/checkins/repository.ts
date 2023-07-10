import type { CheckIn, CreateCheckInInput, UpdateCheckInInput, CheckInFilter } from './types.js';

export interface CheckInRepository {
  create(
    input: CreateCheckInInput & { status: string; createdAt: string; updatedAt: string },
  ): Promise<CheckIn>;
  findById(organizationId: string, id: string): Promise<CheckIn | null>;
  findByName(organizationId: string, name: string): Promise<CheckIn | null>;
  list(filter: CheckInFilter): Promise<CheckIn[]>;
  update(organizationId: string, id: string, input: UpdateCheckInInput): Promise<CheckIn>;
}
