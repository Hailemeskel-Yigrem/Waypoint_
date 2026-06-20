import { describe, it, expect } from 'vitest';
import { MemoryAccessPolicyRepository } from '../../src/modules/access/memory.repository.js';

describe('MemoryAccessPolicyRepository', () => {
  it('orders policies by priority', async () => {
    const repo = new MemoryAccessPolicyRepository();
    await repo.create({
      organizationId: 'o1',
      name: 'Low',
      action: 'book_desk',
      effect: 'allow',
      priority: 100,
      conditions: {},
    });
    await repo.create({
      organizationId: 'o1',
      name: 'High',
      action: 'book_desk',
      effect: 'deny',
      priority: 1,
      conditions: {},
    });
    const policies = await repo.findByAction('o1', 'book_desk');
    expect(policies[0].name).toBe('High');
  });
});
