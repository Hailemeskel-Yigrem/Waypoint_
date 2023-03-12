import { generateId } from '../../lib/id.js';
import { paginate, offsetFromPage, sortItems } from '../../lib/pagination.js';
import type { IntegrationRepository } from './repository.js';
import type { Integration, CreateIntegrationInput, UpdateIntegrationInput } from './types.js';

export class MemoryIntegrationRepository implements IntegrationRepository {
  private readonly store = new Map<string, Integration>();

  private key(orgId: string, id: string): string {
    return `${orgId}:${id}`;
  }

  async create(input: CreateIntegrationInput): Promise<Integration> {
    const now = new Date();
    const integration: Integration = {
      id: generateId('integration'),
      organizationId: input.organizationId,
      provider: input.provider,
      name: input.name,
      status: 'inactive',
      config: input.config,
      lastSyncAt: null,
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(this.key(integration.organizationId, integration.id), integration);
    return integration;
  }

  async findById(organizationId: string, id: string): Promise<Integration | null> {
    const i = this.store.get(this.key(organizationId, id));
    return i?.organizationId === organizationId ? i : null;
  }

  async update(
    organizationId: string,
    id: string,
    input: UpdateIntegrationInput,
  ): Promise<Integration | null> {
    const existing = await this.findById(organizationId, id);
    if (!existing) return null;
    const updated: Integration = {
      ...existing,
      ...input,
      config: input.config ? { ...existing.config, ...input.config } : existing.config,
      updatedAt: new Date(),
    };
    this.store.set(this.key(organizationId, id), updated);
    return updated;
  }

  async delete(organizationId: string, id: string): Promise<boolean> {
    return this.store.delete(this.key(organizationId, id));
  }

  async list(organizationId: string, query) {
    const all = [...this.store.values()].filter((i) => i.organizationId === organizationId);
    const sorted = sortItems(all, query.sortBy as keyof Integration, query.sortOrder);
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
