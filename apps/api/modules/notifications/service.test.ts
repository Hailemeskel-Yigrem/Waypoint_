import { describe, it, expect, beforeEach } from 'vitest';
import { NotificationService } from '../../src/modules/notifications/service.js';
import {
  MemoryNotificationRepository,
  ConsoleNotificationDispatcher,
} from '../../src/modules/notifications/memory.repository.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('NotificationService', () => {
  let service: NotificationService;
  let orgId: string;
  let userId: string;

  beforeEach(async () => {
    orgId = (await new MemoryOrganizationRepository().create({ name: 'O', slug: 'ntf' })).id;
    const userRepo = new MemoryUserRepository();
    userId = (await userRepo.create({ organizationId: orgId, email: 'n@t.com', name: 'N' })).id;
    service = new NotificationService(
      new MemoryNotificationRepository(),
      new ConsoleNotificationDispatcher(),
      userRepo,
    );
  });

  it('sends notification to existing user', async () => {
    const result = await service.send(orgId, {
      userId,
      channel: 'in_app',
      subject: 'Hi',
      body: 'Hello',
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.status).toBe('sent');
  });
});
