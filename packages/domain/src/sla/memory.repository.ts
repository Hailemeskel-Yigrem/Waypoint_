import { randomUUID } from 'node:crypto';
import type {
  SlaTarget,
  CreateSlaTargetInput,
  UpdateSlaTargetInput,
  SlaTargetFilter,
} from './types.js';
import type { SlaTargetRepository } from './repository.js';

export class MemorySlaTargetRepository implements SlaTargetRepository {
  private readonly rows = new Map<string, SlaTarget>();

  private key(organizationId: string, id: string): string {
    return `${organizationId}:${id}`;
  }

  async create(
    input: CreateSlaTargetInput & { status: string; createdAt: string; updatedAt: string },
  ): Promise<SlaTarget> {
    const id = randomUUID();
    const row: SlaTarget = {
      id,
      organizationId: input.organizationId,
      name: input.name,
      status: input.status as SlaTarget['status'],
      metadata: input.metadata,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    };
    this.rows.set(this.key(row.organizationId, row.id), row);
    return row;
  }

  async findById(organizationId: string, id: string): Promise<SlaTarget | null> {
    return this.rows.get(this.key(organizationId, id)) ?? null;
  }

  async findByName(organizationId: string, name: string): Promise<SlaTarget | null> {
    for (const row of this.rows.values()) {
      if (row.organizationId === organizationId && row.name.toLowerCase() === name.toLowerCase()) {
        return row;
      }
    }
    return null;
  }

  async list(filter: SlaTargetFilter): Promise<SlaTarget[]> {
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
    input: UpdateSlaTargetInput,
  ): Promise<SlaTarget> {
    const current = await this.findById(organizationId, id);
    if (!current) throw new Error('SlaTarget not found');
    const next = { ...current, ...input, id: current.id, organizationId };
    this.rows.set(this.key(organizationId, id), next);
    return next;
  }
}
