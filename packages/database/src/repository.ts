import type { DatabaseClient } from './client.js';

export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(
    protected readonly db: DatabaseClient,
    protected readonly table: string,
  ) {}

  async findById(id: string): Promise<T | null> {
    const { rows } = await this.db.query<T>(`SELECT * FROM ${this.table} WHERE id = $1`, [id]);
    return rows[0] ?? null;
  }

  async findByOrg(orgId: string, limit = 100, offset = 0): Promise<T[]> {
    const { rows } = await this.db.query<T>(
      `SELECT * FROM ${this.table} WHERE org_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [orgId, limit, offset],
    );
    return rows as T[];
  }

  async countByOrg(orgId: string): Promise<number> {
    const { rows } = await this.db.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM ${this.table} WHERE org_id = $1`,
      [orgId],
    );
    return parseInt(rows[0]?.count ?? '0', 10);
  }

  async deleteById(id: string): Promise<boolean> {
    const { rowCount } = await this.db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
    return rowCount > 0;
  }
}
