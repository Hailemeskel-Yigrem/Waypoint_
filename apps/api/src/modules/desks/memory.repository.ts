import { generateId } from '../../lib/id.js';
import { paginate, offsetFromPage, sortItems } from '../../lib/pagination.js';
import type { DeskRepository } from './repository.js';
import type { Desk, CreateDeskInput, UpdateDeskInput } from './types.js';

export class MemoryDeskRepository implements DeskRepository {
  private readonly store = new Map<string, Desk>();

  private key(orgId: string, id: string): string {
    return `${orgId}:${id}`;
  }

  async create(input: CreateDeskInput): Promise<Desk> {
    const now = new Date();
    const desk: Desk = {
      id: generateId('desk'),
      organizationId: input.organizationId,
      spaceId: input.spaceId,
      label: input.label,
      isBookable: input.isBookable ?? true,
      amenities: input.amenities ?? [],
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(this.key(desk.organizationId, desk.id), desk);
    return desk;
  }

  async findById(organizationId: string, id: string): Promise<Desk | null> {
    const d = this.store.get(this.key(organizationId, id));
    return d?.organizationId === organizationId ? d : null;
  }

  async findBySpace(organizationId: string, spaceId: string): Promise<Desk[]> {
    return [...this.store.values()].filter(
      (d) => d.organizationId === organizationId && d.spaceId === spaceId,
    );
  }

  async update(organizationId: string, id: string, input: UpdateDeskInput): Promise<Desk | null> {
    const existing = await this.findById(organizationId, id);
    if (!existing) return null;
    const updated: Desk = { ...existing, ...input, updatedAt: new Date() };
    this.store.set(this.key(organizationId, id), updated);
    return updated;
  }

  async delete(organizationId: string, id: string): Promise<boolean> {
    return this.store.delete(this.key(organizationId, id));
  }

  async list(organizationId: string, query) {
    let all = [...this.store.values()].filter((d) => d.organizationId === organizationId);
    if (query.spaceId) all = all.filter((d) => d.spaceId === query.spaceId);
    const sorted = sortItems(all, query.sortBy as keyof Desk, query.sortOrder);
    const offset = offsetFromPage(query.page, query.limit);
    return paginate(sorted.slice(offset, offset + query.limit), query.page, query.limit, all.length);
  }

  async count(organizationId: string): Promise<number> {
    return [...this.store.values()].filter((d) => d.organizationId === organizationId).length;
  }

  clear(): void { this.store.clear(); }
}
