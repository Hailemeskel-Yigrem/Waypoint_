import { generateId } from '../../lib/id.js';
import { paginate, offsetFromPage, sortItems } from '../../lib/pagination.js';
import type { DirectoryRepository } from './repository.js';
import type { DirectoryEntry, CreateDirectoryEntryInput, UpdateDirectoryEntryInput } from './types.js';

export class MemoryDirectoryRepository implements DirectoryRepository {
  private readonly store = new Map<string, DirectoryEntry>();

  private key(orgId: string, id: string): string {
    return `${orgId}:${id}`;
  }

  async create(input: CreateDirectoryEntryInput): Promise<DirectoryEntry> {
    const now = new Date();
    const entry: DirectoryEntry = {
      id: generateId('directoryEntry'),
      organizationId: input.organizationId,
      userId: input.userId ?? null,
      displayName: input.displayName,
      email: input.email.toLowerCase(),
      department: input.department ?? null,
      title: input.title ?? null,
      phone: input.phone ?? null,
      location: input.location ?? null,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(this.key(entry.organizationId, entry.id), entry);
    return entry;
  }

  async findById(organizationId: string, id: string): Promise<DirectoryEntry | null> {
    const e = this.store.get(this.key(organizationId, id));
    return e?.organizationId === organizationId ? e : null;
  }

  async update(organizationId: string, id: string, input: UpdateDirectoryEntryInput): Promise<DirectoryEntry | null> {
    const existing = await this.findById(organizationId, id);
    if (!existing) return null;
    const updated: DirectoryEntry = {
      ...existing,
      ...input,
      email: input.email ? input.email.toLowerCase() : existing.email,
      updatedAt: new Date(),
    };
    this.store.set(this.key(organizationId, id), updated);
    return updated;
  }

  async delete(organizationId: string, id: string): Promise<boolean> {
    return this.store.delete(this.key(organizationId, id));
  }

  async search(organizationId: string, query) {
    let all = [...this.store.values()].filter(
      (e) => e.organizationId === organizationId && e.isVisible,
    );

    if (query.department) {
      all = all.filter((e) => e.department?.toLowerCase() === query.department!.toLowerCase());
    }

    if (query.q) {
      const q = query.q.toLowerCase();
      all = all.filter(
        (e) =>
          e.displayName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.department?.toLowerCase().includes(q) ||
          e.title?.toLowerCase().includes(q),
      );
    }

    const sorted = sortItems(all, query.sortBy as keyof DirectoryEntry, query.sortOrder);
    const offset = offsetFromPage(query.page, query.limit);
    return paginate(sorted.slice(offset, offset + query.limit), query.page, query.limit, all.length);
  }

  clear(): void { this.store.clear(); }
}
