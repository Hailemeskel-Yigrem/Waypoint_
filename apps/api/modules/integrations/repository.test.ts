import { describe, it, expect } from 'vitest';
import { MemoryIntegrationRepository } from '../../src/modules/integrations/memory.repository.js';

describe('MemoryIntegrationRepository', () => {
  it('lists integrations per org', async () => {
    const repo = new MemoryIntegrationRepository();
    await repo.create({ organizationId: 'o1', provider: 'slack', name: 'S', config: { webhookUrl: 'x' } });
    const list = await repo.list('o1', { page: 1, limit: 10, sortOrder: 'desc' });
    expect(list.total).toBe(1);
  });
});

