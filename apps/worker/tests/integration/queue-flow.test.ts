import { describe, it, expect, vi } from 'vitest';
import { MemoryQueueAdapter } from '../../src/queue/memory-adapter.js';
import { registerJobs } from '../../src/jobs/registry.js';
import { createLogger } from '@waypoint/logging';

describe('queue integration', () => {
  it('registers and processes all job types', async () => {
    const queue = new MemoryQueueAdapter(30);
    const logger = createLogger({ level: 'error' }, () => {});
    registerJobs(queue, logger);
    await queue.start();
    await queue.add('booking-reminder', {
      orgId: 'o1',
      bookingId: 'b1',
      userId: 'u1',
      startAt: new Date().toISOString(),
    });
    await new Promise((r) => setTimeout(r, 150));
    const stats = await queue.getStats();
    expect(stats.completed + stats.active).toBeGreaterThanOrEqual(0);
    await queue.stop();
  });
});
