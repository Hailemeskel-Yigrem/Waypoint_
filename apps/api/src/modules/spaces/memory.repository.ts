import { generateId } from '../../lib/id.js';
import { paginate, offsetFromPage, sortItems } from '../../lib/pagination.js';
import type { PaginationQuery } from '../../lib/pagination.js';
import type { SpaceRepository } from './repository.js';
import type { Space, CreateSpaceInput, UpdateSpaceInput } from './types.js';

export class MemorySpaceRepository implements SpaceRepository {
  private readonly store = new Map<string, Space>();

  private key(orgId: string, id: string): string {
    return `${orgId}:${id}`;
  }

  async create(input: CreateSpaceInput): Promise<Space> {
    const now = new Date();
    const space: Space = {
      id: generateId('space'),
      organizationId: input.organizationId,
      name: input.name,
      type: input.type,
      floor: input.floor ?? null,
      capacity: input.capacity ?? 1,
      isActive: true,
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(this.key(space.organizationId, space.id), space);
    return space;
  }

  async findById(organizationId: string, id: string): Promise<Space | null> {
    const s = this.store.get(this.key(organizationId, id));
    return s?.organizationId === organizationId ? s : null;
  }

  async update(organizationId: string, id: string, input: UpdateSpaceInput): Promise<Space | null> {
    const existing = await this.findById(organizationId, id);
    if (!existing) return null;
    const updated: Space = { ...existing, ...input, updatedAt: new Date() };
    this.store.set(this.key(organizationId, id), updated);
    return updated;
  }

  async delete(organizationId: string, id: string): Promise<boolean> {
    return this.store.delete(this.key(organizationId, id));
  }

  async list(organizationId: string, query: PaginationQuery) {
    const all = [...this.store.values()].filter((s) => s.organizationId === organizationId);
    const sorted = sortItems(all, query.sortBy as keyof Space, query.sortOrder);
    const offset = offsetFromPage(query.page, query.limit);
    return paginate(
      sorted.slice(offset, offset + query.limit),
      query.page,
      query.limit,
      all.length,
    );
  }

  async count(organizationId: string): Promise<number> {
    return [...this.store.values()].filter((s) => s.organizationId === organizationId).length;
  }

  clear(): void {
    this.store.clear();
  }
}
