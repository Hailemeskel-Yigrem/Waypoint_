import { describe, it, expect } from 'vitest';
import { MemoryNotificationRepository } from '../../src/modules/notifications/memory.repository.js';

describe('MemoryNotificationRepository', () => {
  it('marks notification read', async () => {
    const repo = new MemoryNotificationRepository();
    const n = await repo.create({
      organizationId: 'o1',
      userId: 'u1',
      channel: 'email',
      subject: 'S',
      body: 'B',
    });
    const updated = await repo.markRead('o1', n.id);
    expect(updated?.status).toBe('read');
  });
});
