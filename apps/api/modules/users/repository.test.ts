import { describe, it, expect } from 'vitest';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';

describe('MemoryUserRepository tenant scoping', () => {
  it('scopes findById to organization', async () => {
    const repo = new MemoryUserRepository();
    const user = await repo.create({ organizationId: 'org1', email: 'a@t.com', name: 'A' });
    expect(await repo.findById('org2', user.id)).toBeNull();
    expect(await repo.findById('org1', user.id)).not.toBeNull();
  });
});

