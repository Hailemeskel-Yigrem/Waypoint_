import { BaseRepository } from '../repository.js';
import type { DatabaseClient } from '../client.js';

export interface NotificationRow {
  id: string;
  org_id: string;
  created_at: string;
}

export class NotificationRepository extends BaseRepository<NotificationRow> {
  constructor(db: DatabaseClient) {
    super(db, 'notifications');
  }
}
