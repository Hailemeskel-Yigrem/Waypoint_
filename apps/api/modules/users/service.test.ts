import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from '../../src/modules/users/service.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';
import { MemorySpaceRepository } from '../../src/modules/spaces/memory.repository.js';
import { MemoryDeskRepository } from '../../src/modules/desks/memory.repository.js';
import { MemoryBookingRepository } from '../../src/modules/bookings/memory.repository.js';
import { MemoryBillingRepository } from '../../src/modules/billing/memory.repository.js';
import { BillingService } from '../../src/modules/billing/service.js';
import { hashPassword } from '../../src/lib/crypto.js';

describe('UserService', () => {
  let service: UserService;
  let orgId: string;

  beforeEach(async () => {
    const orgRepo = new MemoryOrganizationRepository();
    const org = await orgRepo.create({ name: 'Test', slug: 'test' });
    orgId = org.id;
    const billing = new BillingService(
      new MemoryBillingRepository(), orgRepo,
      new MemoryUserRepository(), new MemorySpaceRepository(),
      new MemoryDeskRepository(), new MemoryBookingRepository(),
    );
    service = new UserService(new MemoryUserRepository(), billing, 'test-secret-16chars!!', 'salt');
  });

  it('creates user with hashed password', async () => {
    const result = await service.create(orgId, { email: 'a@test.com', name: 'A', password: 'password123' });
    expect(result.ok).toBe(true);
  });

  it('logs in active user', async () => {
    const repo = new MemoryUserRepository();
    const billing = new BillingService(new MemoryBillingRepository(), new MemoryOrganizationRepository(), repo, new MemorySpaceRepository(), new MemoryDeskRepository(), new MemoryBookingRepository());
    const svc = new UserService(repo, billing, 'test-secret-16chars!!', 'salt');
    await repo.create({ organizationId: orgId, email: 'login@test.com', name: 'Login', passwordHash: hashPassword('password123') });
    const user = await repo.findByEmail(orgId, 'login@test.com');
    await repo.update(orgId, user!.id, { status: 'active' });
    const result = await svc.login({ organizationId: orgId, email: 'login@test.com', password: 'password123' });
    expect(result.ok).toBe(true);
  });
});

