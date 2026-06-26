import { randomUUID } from 'node:crypto';
export class MemoryAssetRepository {
    rows = new Map();
    key(organizationId, id) {
        return `${organizationId}:${id}`;
    }
    async create(input) {
        const id = randomUUID();
        const row = {
            id,
            organizationId: input.organizationId,
            name: input.name,
            status: input.status,
            metadata: input.metadata,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
        };
        this.rows.set(this.key(row.organizationId, row.id), row);
        return row;
    }
    async findById(organizationId, id) {
        return this.rows.get(this.key(organizationId, id)) ?? null;
    }
    async findByName(organizationId, name) {
        for (const row of this.rows.values()) {
            if (row.organizationId === organizationId && row.name.toLowerCase() === name.toLowerCase()) {
                return row;
            }
        }
        return null;
    }
    async list(filter) {
        let rows = [...this.rows.values()].filter((r) => r.organizationId === filter.organizationId);
        if (filter.status)
            rows = rows.filter((r) => r.status === filter.status);
        if (filter.query) {
            const q = filter.query.toLowerCase();
            rows = rows.filter((r) => r.name.toLowerCase().includes(q));
        }
        const offset = filter.offset ?? 0;
        const limit = filter.limit ?? 50;
        return rows.slice(offset, offset + limit);
    }
    async update(organizationId, id, input) {
        const current = await this.findById(organizationId, id);
        if (!current)
            throw new Error('Asset not found');
        const next = { ...current, ...input, id: current.id, organizationId };
        this.rows.set(this.key(organizationId, id), next);
        return next;
    }
}
//# sourceMappingURL=memory.repository.js.map