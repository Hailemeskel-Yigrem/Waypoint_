import { randomUUID } from 'node:crypto';
import type {
  Building,
  CreateBuildingInput,
  UpdateBuildingInput,
  BuildingFilter,
} from './types.js';
import type { BuildingRepository } from './repository.js';

export class MemoryBuildingRepository implements BuildingRepository {
  private readonly rows = new Map<string, Building>();

  private key(organizationId: string, id: string): string {
    return `${organizationId}:${id}`;
  }

  async create(
    input: CreateBuildingInput & { status: string; createdAt: string; updatedAt: string },
  ): Promise<Building> {
    const id = randomUUID();
    const row: Building = {
      id,
      organizationId: input.organizationId,
      name: input.name,
      status: input.status as Building['status'],
      metadata: input.metadata,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    };
    this.rows.set(this.key(row.organizationId, row.id), row);
    return row;
  }

  async findById(organizationId: string, id: string): Promise<Building | null> {
    return this.rows.get(this.key(organizationId, id)) ?? null;
  }

  async findByName(organizationId: string, name: string): Promise<Building | null> {
    for (const row of this.rows.values()) {
      if (row.organizationId === organizationId && row.name.toLowerCase() === name.toLowerCase()) {
        return row;
      }
    }
    return null;
  }

  async list(filter: BuildingFilter): Promise<Building[]> {
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

  async update(organizationId: string, id: string, input: UpdateBuildingInput): Promise<Building> {
    const current = await this.findById(organizationId, id);
    if (!current) throw new Error('Building not found');
    const next = { ...current, ...input, id: current.id, organizationId };
    this.rows.set(this.key(organizationId, id), next);
    return next;
  }
}
