import { BaseRepository } from '../repository.js';
import type { DatabaseClient } from '../client.js';

export interface BookingRow {
  id: string;
  org_id: string;
  user_id: string;
  resource_type: string;
  resource_id: string;
  start_at: string;
  end_at: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export class BookingRepository extends BaseRepository<BookingRow> {
  constructor(db: DatabaseClient) {
    super(db, 'bookings');
  }

  async findUpcoming(orgId: string, withinMinutes: number): Promise<BookingRow[]> {
    const { rows } = await this.db.query<BookingRow>(
      `SELECT * FROM bookings WHERE org_id = $1 AND status = 'confirmed'
       AND start_at BETWEEN NOW() AND NOW() + ($2 || ' minutes')::interval
       ORDER BY start_at ASC`,
      [orgId, withinMinutes],
    );
    return rows;
  }
}
