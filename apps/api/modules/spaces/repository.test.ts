import { describe, it, expect } from 'vitest';
import { MemorySpaceRepository } from '../../src/modules/spaces/memory.repository.js';

describe('MemorySpaceRepository', () => {
  it('counts spaces per tenant', async () => {
    const repo = new MemorySpaceRepository();
    await repo.create({ organizationId: 'o1', name: 'S1', type: 'office' });
    await repo.create({ organizationId: 'o1', name: 'S2', type: 'office' });
    await repo.create({ organizationId: 'o2', name: 'S3', type: 'office' });
    expect(await repo.count('o1')).toBe(2);
  });
});

