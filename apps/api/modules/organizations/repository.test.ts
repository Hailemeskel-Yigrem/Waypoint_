import { describe, it, expect } from 'vitest';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('MemoryOrganizationRepository', () => {
  it('finds by slug', async () => {
    const repo = new MemoryOrganizationRepository();
    await repo.create({ name: 'X', slug: 'x-corp' });
    const found = await repo.findBySlug('x-corp');
    expect(found?.name).toBe('X');
  });
});

