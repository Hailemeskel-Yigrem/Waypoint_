import { describe, it, expect } from 'vitest';
import { MemoryDirectoryRepository } from '../../src/modules/directory/memory.repository.js';

describe('MemoryDirectoryRepository search', () => {
  it('filters hidden entries', async () => {
    const repo = new MemoryDirectoryRepository();
    const e = await repo.create({ organizationId: 'o1', displayName: 'Hidden', email: 'h@t.com' });
    await repo.update('o1', e.id, { isVisible: false });
    const results = await repo.search('o1', { page: 1, limit: 10, sortOrder: 'desc', q: 'Hidden' });
    expect(results.items).toHaveLength(0);
  });
});
