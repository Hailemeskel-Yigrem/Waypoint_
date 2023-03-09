import { AppError } from '../../lib/errors.js';
import { ok, err, type Result } from '../../lib/result.js';
import type { DirectoryRepository } from './repository.js';
import type { DirectoryEntry, CreateDirectoryEntryInput, UpdateDirectoryEntryInput, DirectorySearchQuery } from './types.js';
import type { PaginationQuery, PaginatedResult } from '../../lib/pagination.js';

export class DirectoryService {
  constructor(private readonly repo: DirectoryRepository) {}

  async create(organizationId: string, input: Omit<CreateDirectoryEntryInput, 'organizationId'>): Promise<Result<DirectoryEntry>> {
    const entry = await this.repo.create({ ...input, organizationId });
    return ok(entry);
  }

  async getById(organizationId: string, id: string): Promise<Result<DirectoryEntry>> {
    const entry = await this.repo.findById(organizationId, id);
    if (!entry) return err(AppError.notFound('DirectoryEntry', id));
    return ok(entry);
  }

  async update(organizationId: string, id: string, input: UpdateDirectoryEntryInput): Promise<Result<DirectoryEntry>> {
    const updated = await this.repo.update(organizationId, id, input);
    if (!updated) return err(AppError.notFound('DirectoryEntry', id));
    return ok(updated);
  }

  async delete(organizationId: string, id: string): Promise<Result<void>> {
    const deleted = await this.repo.delete(organizationId, id);
    if (!deleted) return err(AppError.notFound('DirectoryEntry', id));
    return ok(undefined);
  }

  async search(organizationId: string, query: PaginationQuery & DirectorySearchQuery): Promise<PaginatedResult<DirectoryEntry>> {
    return this.repo.search(organizationId, query);
  }
}
