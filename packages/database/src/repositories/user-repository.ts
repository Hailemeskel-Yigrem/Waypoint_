import { BaseRepository } from '../repository.js';
import type { DatabaseClient } from '../client.js';

export interface UserRow {
  id: string;
  org_id: string;
  created_at: string;
}

export class UserRepository extends BaseRepository<UserRow> {
  constructor(db: DatabaseClient) {
    super(db, 'users');
  }
}
