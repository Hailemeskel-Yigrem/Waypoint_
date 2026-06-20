import type { Pool } from 'pg';
import type { DatabaseClient } from '../plugins/database.js';
import type { OrganizationRepository } from '../modules/organizations/repository.js';
import type {
  Organization,
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from '../modules/organizations/types.js';
import type { PaginationQuery, PaginatedResult } from '../lib/pagination.js';

/**
 * Thin PostgreSQL adapter for organizations.
 * Additional module adapters follow the same pattern: typed SQL + tenant scoping.
 */
export class PostgresOrganizationRepository implements OrganizationRepository {
  constructor(private readonly db: DatabaseClient) {}

  async create(input: CreateOrganizationInput): Promise<Organization> {
    const result = await this.db.query<Organization>(
      `INSERT INTO organizations (name, slug, plan, status, settings)
       VALUES ($1, $2, $3, 'trial', $4)
       RETURNING *`,
      [input.name, input.slug, input.plan ?? 'free', JSON.stringify(input.settings ?? {})],
    );
    return result.rows[0];
  }

  async findById(id: string): Promise<Organization | null> {
    const result = await this.db.query<Organization>('SELECT * FROM organizations WHERE id = $1', [
      id,
    ]);
    return result.rows[0] ?? null;
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const result = await this.db.query<Organization>(
      'SELECT * FROM organizations WHERE slug = $1',
      [slug],
    );
    return result.rows[0] ?? null;
  }

  async update(id: string, input: UpdateOrganizationInput): Promise<Organization | null> {
    const result = await this.db.query<Organization>(
      `UPDATE organizations SET
         name = COALESCE($2, name),
         slug = COALESCE($3, slug),
         plan = COALESCE($4, plan),
         status = COALESCE($5, status),
         settings = COALESCE($6, settings),
         updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [
        id,
        input.name ?? null,
        input.slug ?? null,
        input.plan ?? null,
        input.status ?? null,
        input.settings ? JSON.stringify(input.settings) : null,
      ],
    );
    return result.rows[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.query('DELETE FROM organizations WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async list(query: PaginationQuery): Promise<PaginatedResult<Organization>> {
    const offset = (query.page - 1) * query.limit;
    const countResult = await this.db.query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM organizations',
    );
    const total = parseInt(countResult.rows[0]?.count ?? '0', 10);
    const result = await this.db.query<Organization>(
      `SELECT * FROM organizations ORDER BY created_at ${query.sortOrder === 'asc' ? 'ASC' : 'DESC'}
       LIMIT $1 OFFSET $2`,
      [query.limit, offset],
    );
    return {
      items: result.rows,
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    };
  }

  async countByPlan(plan: Organization['plan']): Promise<number> {
    const result = await this.db.query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM organizations WHERE plan = $1',
      [plan],
    );
    return parseInt(result.rows[0]?.count ?? '0', 10);
  }
}

export function createPoolRepositories(db: DatabaseClient): {
  organizations: OrganizationRepository;
} {
  return {
    organizations: new PostgresOrganizationRepository(db),
  };
}

export type { Pool };
