import type {
  DirectoryEntry,
  CreateDirectoryEntryInput,
  UpdateDirectoryEntryInput,
  DirectorySearchQuery,
} from './types.js';
import type { PaginatedResult, PaginationQuery } from '../../lib/pagination.js';

export interface DirectoryRepository {
  create(input: CreateDirectoryEntryInput): Promise<DirectoryEntry>;
  findById(organizationId: string, id: string): Promise<DirectoryEntry | null>;
  update(
    organizationId: string,
    id: string,
    input: UpdateDirectoryEntryInput,
  ): Promise<DirectoryEntry | null>;
  delete(organizationId: string, id: string): Promise<boolean>;
  search(
    organizationId: string,
    query: PaginationQuery & DirectorySearchQuery,
  ): Promise<PaginatedResult<DirectoryEntry>>;
}
