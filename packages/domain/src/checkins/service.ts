import { ok, err, type Result } from '../result.js';
import { ValidationError, ConflictError, NotFoundError, ForbiddenError } from '../errors.js';
import type { CheckIn, CreateCheckInInput, UpdateCheckInInput, CheckInFilter } from './types.js';
import type { CheckInRepository } from './repository.js';

export class CheckInService {
  constructor(private readonly repo: CheckInRepository) {}

  // Rule: Check-ins require active booking
  // Rule: Geofence optional

  async create(input: CreateCheckInInput): Promise<Result<CheckIn, Error>> {
    if (!input.organizationId?.trim()) {
      return err(new ValidationError('organizationId is required'));
    }
    if (!input.name?.trim()) {
      return err(new ValidationError('name is required'));
    }
    const existing = await this.repo.findByName(input.organizationId, input.name);
    if (existing) {
      return err(new ConflictError(`checkins already exists: ${input.name}`));
    }
    const created = await this.repo.create({
      ...input,
      name: input.name.trim(),
      status: input.status ?? 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return ok(created);
  }

  async get(organizationId: string, id: string): Promise<Result<CheckIn, Error>> {
    const row = await this.repo.findById(organizationId, id);
    if (!row) return err(new NotFoundError('CheckIn not found'));
    return ok(row);
  }

  async list(filter: CheckInFilter): Promise<Result<CheckIn[], Error>> {
    if (!filter.organizationId) {
      return err(new ValidationError('organizationId is required'));
    }
    const rows = await this.repo.list(filter);
    return ok(rows);
  }

  async update(
    organizationId: string,
    id: string,
    input: UpdateCheckInInput,
    actorRole: string,
  ): Promise<Result<CheckIn, Error>> {
    if (!['owner', 'admin', 'manager'].includes(actorRole)) {
      return err(new ForbiddenError('insufficient role to update checkins'));
    }
    const current = await this.repo.findById(organizationId, id);
    if (!current) return err(new NotFoundError('CheckIn not found'));
    const updated = await this.repo.update(organizationId, id, {
      ...input,
      updatedAt: new Date().toISOString(),
    });
    return ok(updated);
  }

  async archive(
    organizationId: string,
    id: string,
    actorRole: string,
  ): Promise<Result<CheckIn, Error>> {
    if (!['owner', 'admin'].includes(actorRole)) {
      return err(new ForbiddenError('insufficient role to archive checkins'));
    }
    const current = await this.repo.findById(organizationId, id);
    if (!current) return err(new NotFoundError('CheckIn not found'));
    if (current.status === 'archived') {
      return err(new ConflictError('CheckIn already archived'));
    }
    const updated = await this.repo.update(organizationId, id, {
      status: 'archived',
      updatedAt: new Date().toISOString(),
    });
    return ok(updated);
  }
}
