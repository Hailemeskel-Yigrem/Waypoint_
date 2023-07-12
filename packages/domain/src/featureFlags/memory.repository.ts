import { randomUUID } from 'node:crypto';
import type {
  FeatureFlag,
  CreateFeatureFlagInput,
  UpdateFeatureFlagInput,
  FeatureFlagFilter,
} from './types.js';
import type { FeatureFlagRepository } from './repository.js';

export class MemoryFeatureFlagRepository implements FeatureFlagRepository {
  private readonly rows = new Map<string, FeatureFlag>();

  private key(organizationId: string, id: string): string {
    return `${organizationId}:${id}`;
  }

  async create(
    input: CreateFeatureFlagInput & { status: string; createdAt: string; updatedAt: string },
  ): Promise<FeatureFlag> {
    const id = randomUUID();
    const row: FeatureFlag = {
      id,
      organizationId: input.organizationId,
      name: input.name,
      status: input.status as FeatureFlag['status'],
      metadata: input.metadata,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    };
    this.rows.set(this.key(row.organizationId, row.id), row);
    return row;
  }

  async findById(organizationId: string, id: string): Promise<FeatureFlag | null> {
    return this.rows.get(this.key(organizationId, id)) ?? null;
  }

  async findByName(organizationId: string, name: string): Promise<FeatureFlag | null> {
    for (const row of this.rows.values()) {
      if (row.organizationId === organizationId && row.name.toLowerCase() === name.toLowerCase()) {
        return row;
      }
    }
    return null;
  }

  async list(filter: FeatureFlagFilter): Promise<FeatureFlag[]> {
    let rows = [...this.rows.values()].filter((r) => r.organizationId === filter.organizationId);
    if (filter.status) rows = rows.filter((r) => r.status === filter.status);
    if (filter.query) {
      const q = filter.query.toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(q));
    }
    const offset = filter.offset ?? 0;
    const limit = filter.limit ?? 50;
    return rows.slice(offset, offset + limit);
  }

  async update(
    organizationId: string,
    id: string,
    input: UpdateFeatureFlagInput,
  ): Promise<FeatureFlag> {
    const current = await this.findById(organizationId, id);
    if (!current) throw new Error('FeatureFlag not found');
    const next = { ...current, ...input, id: current.id, organizationId };
    this.rows.set(this.key(organizationId, id), next);
    return next;
  }
}
