import { describe, it, expect, beforeEach } from 'vitest';
import { DirectoryService } from '../../src/modules/directory/service.js';
import { MemoryDirectoryRepository } from '../../src/modules/directory/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('DirectoryService', () => {
  let service: DirectoryService;
  let orgId: string;

  beforeEach(async () => {
    orgId = (await new MemoryOrganizationRepository().create({ name: 'O', slug: 'dir' })).id;
    service = new DirectoryService(new MemoryDirectoryRepository());
  });

  it('searches directory entries', async () => {
    await service.create(orgId, { displayName: 'Jane Doe', email: 'jane@acme.test', department: 'Engineering' });
    const result = await service.search(orgId, { page: 1, limit: 20, sortOrder: 'desc', q: 'jane' });
    expect(result.items.length).toBe(1);
  });
});

