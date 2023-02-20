import { describe, it, expect, beforeEach } from 'vitest';
import { OrganizationService } from '../../src/modules/organizations/service.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('OrganizationService', () => {
  let service: OrganizationService;
  beforeEach(() => { service = new OrganizationService(new MemoryOrganizationRepository()); });

  it('creates organization', async () => {
    const result = await service.create({ name: 'Waypoint HQ', slug: 'waypoint-hq' });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.slug).toBe('waypoint-hq');
  });

  it('rejects duplicate slug', async () => {
    await service.create({ name: 'A', slug: 'dup' });
    const result = await service.create({ name: 'B', slug: 'dup' });
    expect(result.ok).toBe(false);
  });
});

