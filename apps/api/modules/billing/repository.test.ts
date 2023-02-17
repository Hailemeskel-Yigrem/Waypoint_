import { describe, it, expect } from 'vitest';
import { MemoryBillingRepository } from '../../src/modules/billing/memory.repository.js';

describe('MemoryBillingRepository', () => {
  it('upserts subscription', async () => {
    const repo = new MemoryBillingRepository();
    const sub = await repo.upsertSubscription('o1', 'starter', 25);
    expect(sub.plan).toBe('starter');
    expect(await repo.getSubscription('o1')).not.toBeNull();
  });
});

