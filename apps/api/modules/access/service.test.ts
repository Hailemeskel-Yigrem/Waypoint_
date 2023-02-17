import { describe, it, expect, beforeEach } from 'vitest';
import { AccessService } from '../../src/modules/access/service.js';
import { MemoryAccessPolicyRepository, evaluatePolicies } from '../../src/modules/access/memory.repository.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('AccessService policy evaluation', () => {
  let service: AccessService;
  let orgId: string;
  let userId: string;
  let repo: MemoryAccessPolicyRepository;

  beforeEach(async () => {
    orgId = (await new MemoryOrganizationRepository().create({ name: 'O', slug: 'acc' })).id;
    const userRepo = new MemoryUserRepository();
    userId = (await userRepo.create({ organizationId: orgId, email: 'v@t.com', name: 'V', role: 'viewer' })).id;
    repo = new MemoryAccessPolicyRepository();
    service = new AccessService(repo, userRepo);
  });

  it('denies booking when deny policy matches', async () => {
    await repo.create({
      organizationId: orgId, name: 'No viewers', action: 'book_desk', effect: 'deny', priority: 1,
      conditions: { roles: ['viewer'] },
    });
    const result = await service.canBook(orgId, userId, 'desk1', null);
    expect(result.ok).toBe(false);
  });

  it('evaluatePolicies returns first matching policy', async () => {
    const p = await repo.create({
      organizationId: orgId, name: 'Allow admins', action: 'book_space', effect: 'allow', priority: 1,
      conditions: { roles: ['admin'] },
    });
    const match = evaluatePolicies([p], {
      organizationId: orgId, userId: 'x', userRole: 'admin', action: 'book_space',
    });
    expect(match?.id).toBe(p.id);
  });
});

