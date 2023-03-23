import { generateId } from '../../lib/id.js';
import { paginate, offsetFromPage, sortItems } from '../../lib/pagination.js';
import type { PaginationQuery } from '../../lib/pagination.js';
import type { UserRepository } from './repository.js';
import type { User, CreateUserInput, UpdateUserInput } from './types.js';

export class MemoryUserRepository implements UserRepository {
  private readonly store = new Map<string, User>();

  private key(orgId: string, id: string): string {
    return `${orgId}:${id}`;
  }

  async create(input: CreateUserInput & { passwordHash?: string | null }): Promise<User> {
    const now = new Date();
    const user: User = {
      id: generateId('user'),
      organizationId: input.organizationId,
      email: input.email.toLowerCase(),
      name: input.name,
      role: input.role ?? 'member',
      status: 'invited',
      passwordHash: input.passwordHash ?? null,
      apiKeyHash: null,
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(this.key(user.organizationId, user.id), user);
    return user;
  }

  async findById(organizationId: string, id: string): Promise<User | null> {
    const user = this.store.get(this.key(organizationId, id));
    if (!user || user.organizationId !== organizationId) return null;
    return user;
  }

  async findByEmail(organizationId: string, email: string): Promise<User | null> {
    const normalized = email.toLowerCase();
    for (const user of this.store.values()) {
      if (user.organizationId === organizationId && user.email === normalized) return user;
    }
    return null;
  }

  async findByApiKeyHash(keyHash: string): Promise<User | null> {
    for (const user of this.store.values()) {
      if (user.apiKeyHash === keyHash && user.status === 'active') return user;
    }
    return null;
  }

  async update(
    organizationId: string,
    id: string,
    input: UpdateUserInput & { passwordHash?: string | null; apiKeyHash?: string | null },
  ): Promise<User | null> {
    const existing = await this.findById(organizationId, id);
    if (!existing) return null;
    const updated: User = {
      ...existing,
      ...input,
      passwordHash: input.passwordHash !== undefined ? input.passwordHash : existing.passwordHash,
      apiKeyHash: input.apiKeyHash !== undefined ? input.apiKeyHash : existing.apiKeyHash,
      updatedAt: new Date(),
    };
    this.store.set(this.key(organizationId, id), updated);
    return updated;
  }

  async delete(organizationId: string, id: string): Promise<boolean> {
    return this.store.delete(this.key(organizationId, id));
  }

  async list(organizationId: string, query: PaginationQuery) {
    const all = [...this.store.values()].filter((u) => u.organizationId === organizationId);
    const sorted = sortItems(all, query.sortBy as keyof User, query.sortOrder);
    const total = sorted.length;
    const offset = offsetFromPage(query.page, query.limit);
    return paginate(sorted.slice(offset, offset + query.limit), query.page, query.limit, total);
  }

  async countActive(organizationId: string): Promise<number> {
    return [...this.store.values()].filter(
      (u) => u.organizationId === organizationId && u.status === 'active',
    ).length;
  }

  clear(): void {
    this.store.clear();
  }
}
