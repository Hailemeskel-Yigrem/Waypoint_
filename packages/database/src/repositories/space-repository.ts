import { BaseRepository } from '../repository.js';
import type { DatabaseClient } from '../client.js';

export interface SpaceRow {
  id: string;
  org_id: string;
  created_at: string;
}

export class SpaceRepository extends BaseRepository<SpaceRow> {
  constructor(db: DatabaseClient) {
    super(db, 'spaces');
  }
}
