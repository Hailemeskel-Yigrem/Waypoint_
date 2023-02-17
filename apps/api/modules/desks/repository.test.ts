import { describe, it, expect } from 'vitest';
import { MemoryDeskRepository } from '../../src/modules/desks/memory.repository.js';

describe('MemoryDeskRepository', () => {
  it('lists desks by space', async () => {
    const repo = new MemoryDeskRepository();
    await repo.create({ organizationId: 'o1', spaceId: 's1', label: 'A' });
    await repo.create({ organizationId: 'o1', spaceId: 's2', label: 'B' });
    expect((await repo.findBySpace('o1', 's1')).length).toBe(1);
  });
});

