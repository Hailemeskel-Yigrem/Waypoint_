import { BaseRepository } from '../repository.js';
import type { DatabaseClient } from '../client.js';

export interface VisitorRow {
  id: string;
  org_id: string;
  host_user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  expected_at: string;
  expires_at: string;
  status: string;
}

export class VisitorRepository extends BaseRepository<VisitorRow> {
  constructor(db: DatabaseClient) {
    super(db, 'visitors');
  }

  async findExpired(): Promise<VisitorRow[]> {
    const { rows } = await this.db.query<VisitorRow>(
      `SELECT * FROM visitors WHERE status IN ('expected', 'checked_in') AND expires_at < NOW()`,
    );
    return rows;
  }
}
