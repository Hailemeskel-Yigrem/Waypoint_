import { generateId } from '../../lib/id.js';
import { generateToken } from '../../lib/crypto.js';
import { paginate, offsetFromPage, sortItems } from '../../lib/pagination.js';
import type { VisitorRepository } from './repository.js';
import type { Visitor, CreateVisitorInput, UpdateVisitorInput } from './types.js';

export class MemoryVisitorRepository implements VisitorRepository {
  private readonly store = new Map<string, Visitor>();

  private key(orgId: string, id: string): string {
    return `${orgId}:${id}`;
  }

  async create(
    input: CreateVisitorInput & { checkInWindowStart: Date; checkInWindowEnd: Date },
  ): Promise<Visitor> {
    const now = new Date();
    const visitor: Visitor = {
      id: generateId('visitor'),
      organizationId: input.organizationId,
      hostUserId: input.hostUserId,
      name: input.name,
      email: input.email ?? null,
      company: input.company ?? null,
      expectedArrival: input.expectedArrival,
      checkInWindowStart: input.checkInWindowStart,
      checkInWindowEnd: input.checkInWindowEnd,
      checkedInAt: null,
      checkedOutAt: null,
      status: 'expected',
      badgeCode: null,
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(this.key(visitor.organizationId, visitor.id), visitor);
    return visitor;
  }

  async findById(organizationId: string, id: string): Promise<Visitor | null> {
    const v = this.store.get(this.key(organizationId, id));
    return v?.organizationId === organizationId ? v : null;
  }

  async update(
    organizationId: string,
    id: string,
    input: UpdateVisitorInput,
  ): Promise<Visitor | null> {
    const existing = await this.findById(organizationId, id);
    if (!existing) return null;
    const updated: Visitor = { ...existing, ...input, updatedAt: new Date() };
    this.store.set(this.key(organizationId, id), updated);
    return updated;
  }

  async list(organizationId: string, query) {
    let all = [...this.store.values()].filter((v) => v.organizationId === organizationId);
    if (query.hostUserId) all = all.filter((v) => v.hostUserId === query.hostUserId);
    if (query.status) all = all.filter((v) => v.status === query.status);
    const sorted = sortItems(all, query.sortBy as keyof Visitor, query.sortOrder);
    const offset = offsetFromPage(query.page, query.limit);
    return paginate(
      sorted.slice(offset, offset + query.limit),
      query.page,
      query.limit,
      all.length,
    );
  }

  clear(): void {
    this.store.clear();
  }
}
