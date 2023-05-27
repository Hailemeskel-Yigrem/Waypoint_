import { describe, it, expect, vi } from 'vitest';
import { BaseRepository } from './repository.js';

class TestRepo extends BaseRepository<{ id: string; org_id: string; created_at: string }> {
  constructor(db: any) {
    super(db, 'test_table');
  }
}

describe('BaseRepository', () => {
  it('findById returns row', async () => {
    const db = {
      query: vi.fn().mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 }),
      close: vi.fn(),
    };
    const repo = new TestRepo(db);
    expect(await repo.findById('1')).toEqual({ id: '1' });
  });
});
