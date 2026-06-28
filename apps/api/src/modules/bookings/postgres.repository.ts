import type { QueryResultRow } from 'pg';
import type { DatabaseClient } from '../../plugins/database.js';
import type { PaginatedResult, PaginationQuery } from '../../lib/pagination.js';
import type { BookingRepository } from './repository.js';
import type {
  Booking,
  BookingConflictQuery,
  CreateBookingInput,
  UpdateBookingInput,
} from './types.js';

interface BookingRow extends QueryResultRow {
  id: string;
  org_id: string;
  user_id: string;
  resource_type: 'desk' | 'space';
  resource_id: string;
  title: string;
  start_at: Date | string;
  end_at: Date | string;
  status: Booking['status'];
  notes: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

const ACTIVE_STATUSES = ['pending', 'confirmed', 'checked_in'];
const SORT_COLUMNS: Record<string, string> = {
  createdAt: 'created_at',
  startTime: 'start_at',
  endTime: 'end_at',
  title: 'title',
  status: 'status',
};

function toBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    organizationId: row.org_id,
    userId: row.user_id,
    deskId: row.resource_type === 'desk' ? row.resource_id : null,
    spaceId: row.resource_type === 'space' ? row.resource_id : null,
    title: row.title,
    startTime: new Date(row.start_at),
    endTime: new Date(row.end_at),
    status: row.status,
    notes: row.notes,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export class PostgresBookingRepository implements BookingRepository {
  constructor(private readonly db: DatabaseClient) {}

  async create(input: CreateBookingInput): Promise<Booking> {
    const resourceType = input.deskId ? 'desk' : 'space';
    const resourceId = input.deskId ?? input.spaceId;
    if (!resourceId) throw new Error('A desk or space is required');

    const result = await this.db.query<BookingRow>(
      `INSERT INTO bookings (
         org_id, user_id, resource_type, resource_id, title, start_at, end_at, notes
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        input.organizationId,
        input.userId,
        resourceType,
        resourceId,
        input.title,
        input.startTime,
        input.endTime,
        input.notes ?? null,
      ],
    );
    const row = result.rows[0];
    if (!row) throw new Error('Booking insert returned no row');
    return toBooking(row);
  }

  async findById(organizationId: string, id: string): Promise<Booking | null> {
    const result = await this.db.query<BookingRow>(
      'SELECT * FROM bookings WHERE org_id = $1 AND id = $2',
      [organizationId, id],
    );
    return result.rows[0] ? toBooking(result.rows[0]) : null;
  }

  async update(
    organizationId: string,
    id: string,
    input: UpdateBookingInput,
  ): Promise<Booking | null> {
    const result = await this.db.query<BookingRow>(
      `UPDATE bookings SET
         title = COALESCE($3, title),
         start_at = COALESCE($4, start_at),
         end_at = COALESCE($5, end_at),
         status = COALESCE($6, status),
         notes = CASE WHEN $8::boolean THEN $7 ELSE notes END,
         updated_at = NOW()
       WHERE org_id = $1 AND id = $2
       RETURNING *`,
      [
        organizationId,
        id,
        input.title ?? null,
        input.startTime ?? null,
        input.endTime ?? null,
        input.status ?? null,
        input.notes ?? null,
        input.notes !== undefined,
      ],
    );
    return result.rows[0] ? toBooking(result.rows[0]) : null;
  }

  async delete(organizationId: string, id: string): Promise<boolean> {
    const result = await this.db.query('DELETE FROM bookings WHERE org_id = $1 AND id = $2', [
      organizationId,
      id,
    ]);
    return (result.rowCount ?? 0) > 0;
  }

  async list(
    organizationId: string,
    query: PaginationQuery & { userId?: string; deskId?: string; spaceId?: string },
  ): Promise<PaginatedResult<Booking>> {
    const params: unknown[] = [organizationId];
    const filters = ['org_id = $1'];
    const addFilter = (column: string, value: string) => {
      params.push(value);
      filters.push(`${column} = $${params.length}`);
    };

    if (query.userId) addFilter('user_id', query.userId);
    if (query.deskId) {
      addFilter('resource_type', 'desk');
      addFilter('resource_id', query.deskId);
    }
    if (query.spaceId) {
      addFilter('resource_type', 'space');
      addFilter('resource_id', query.spaceId);
    }

    const where = filters.join(' AND ');
    const countResult = await this.db.query<{ count: string } & QueryResultRow>(
      `SELECT COUNT(*)::text AS count FROM bookings WHERE ${where}`,
      params,
    );
    const total = Number(countResult.rows[0]?.count ?? 0);
    const sortColumn = SORT_COLUMNS[query.sortBy ?? ''] ?? 'created_at';
    const sortOrder = query.sortOrder === 'asc' ? 'ASC' : 'DESC';
    const offset = (query.page - 1) * query.limit;
    params.push(query.limit, offset);

    const result = await this.db.query<BookingRow>(
      `SELECT * FROM bookings
       WHERE ${where}
       ORDER BY ${sortColumn} ${sortOrder}
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );
    return {
      items: result.rows.map(toBooking),
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    };
  }

  async findConflicts(query: BookingConflictQuery): Promise<Booking[]> {
    const resourceType = query.deskId ? 'desk' : 'space';
    const resourceId = query.deskId ?? query.spaceId;
    if (!resourceId) return [];

    const result = await this.db.query<BookingRow>(
      `SELECT * FROM bookings
       WHERE org_id = $1
         AND resource_type = $2
         AND resource_id = $3
         AND status = ANY($4::text[])
         AND start_at < $6
         AND end_at > $5
         AND ($7::uuid IS NULL OR id <> $7::uuid)
       ORDER BY start_at`,
      [
        query.organizationId,
        resourceType,
        resourceId,
        ACTIVE_STATUSES,
        query.startTime,
        query.endTime,
        query.excludeId ?? null,
      ],
    );
    return result.rows.map(toBooking);
  }

  async countThisMonth(organizationId: string): Promise<number> {
    const result = await this.db.query<{ count: string } & QueryResultRow>(
      `SELECT COUNT(*)::text AS count
       FROM bookings
       WHERE org_id = $1
         AND status <> 'cancelled'
         AND created_at >= date_trunc('month', CURRENT_DATE)
         AND created_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'`,
      [organizationId],
    );
    return Number(result.rows[0]?.count ?? 0);
  }
}
