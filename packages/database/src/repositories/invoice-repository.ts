import { BaseRepository } from '../repository.js';
import type { DatabaseClient } from '../client.js';

export interface InvoiceRow {
  id: string;
  org_id: string;
  created_at: string;
}

export class InvoiceRepository extends BaseRepository<InvoiceRow> {
  constructor(db: DatabaseClient) {
    super(db, 'invoices');
  }
}
