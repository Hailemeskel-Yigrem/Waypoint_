import { describe, it, expect } from 'vitest';
import { MemoryVisitorRepository } from '../../src/modules/visitors/memory.repository.js';

describe('MemoryVisitorRepository', () => {
  it('stores visitor with window', async () => {
    const repo = new MemoryVisitorRepository();
    const v = await repo.create({
      organizationId: 'o1',
      hostUserId: 'h1',
      name: 'G',
      expectedArrival: new Date(),
      checkInWindowStart: new Date(),
      checkInWindowEnd: new Date(),
    });
    expect(v.status).toBe('expected');
  });
});
