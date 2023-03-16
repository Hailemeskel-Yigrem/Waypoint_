import { generateId } from '../../lib/id.js';
import { paginate, offsetFromPage, sortItems } from '../../lib/pagination.js';
import type { PaginationQuery } from '../../lib/pagination.js';
import type { OrganizationRepository } from './repository.js';
import type { Organization, CreateOrganizationInput, UpdateOrganizationInput } from './types.js';
import { DEFAULT_ORG_SETTINGS } from './types.js';

export class MemoryOrganizationRepository implements OrganizationRepository {
  private readonly store = new Map<string, Organization>();

  async create(input: CreateOrganizationInput): Promise<Organization> {
    const now = new Date();
    const org: Organization = {
      id: generateId('organization'),
      name: input.name,
      slug: input.slug,
      plan: input.plan ?? 'free',
      status: 'trial',
      settings: { ...DEFAULT_ORG_SETTINGS, ...input.settings },
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(org.id, org);
    return org;
  }

  async findById(id: string): Promise<Organization | null> {
    return this.store.get(id) ?? null;
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    for (const org of this.store.values()) {
      if (org.slug === slug) return org;
    }
    return null;
  }

  async update(id: string, input: UpdateOrganizationInput): Promise<Organization | null> {
    const existing = this.store.get(id);
    if (!existing) return null;
    const updated: Organization = {
      ...existing,
      ...input,
      settings: input.settings ? { ...existing.settings, ...input.settings } : existing.settings,
      updatedAt: new Date(),
    };
    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }

  async list(query: PaginationQuery) {
    const all = sortItems(
      [...this.store.values()],
      query.sortBy as keyof Organization,
      query.sortOrder,
    );
    const total = all.length;
    const offset = offsetFromPage(query.page, query.limit);
    const items = all.slice(offset, offset + query.limit);
    return paginate(items, query.page, query.limit, total);
  }

  async countByPlan(plan: Organization['plan']): Promise<number> {
    return [...this.store.values()].filter((o) => o.plan === plan).length;
  }

  clear(): void {
    this.store.clear();
  }
}
