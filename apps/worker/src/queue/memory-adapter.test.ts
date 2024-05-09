import { describe, it, expect, vi } from 'vitest';
import { MemoryQueueAdapter } from './memory-adapter.js';

describe('MemoryQueueAdapter', () => {
  it('processes jobs', async () => {
    const queue = new MemoryQueueAdapter(50);
    const handler = vi.fn();
    queue.process('test-job', handler);
    await queue.start();
    await queue.add('test-job', { foo: 'bar' });
    await new Promise((r) => setTimeout(r, 200));
    await queue.stop();
    expect(handler).toHaveBeenCalled();
  });

  it('retries failed jobs', async () => {
    const queue = new MemoryQueueAdapter(50);
    let calls = 0;
    queue.process('fail-job', async () => {
      calls++;
      if (calls < 2) throw new Error('fail');
    });
    await queue.start();
    const job = await queue.add('fail-job', {}, { maxAttempts: 3 });
    await new Promise((r) => setTimeout(r, 400));
    await queue.stop();
    const final = await queue.getJob(job.id);
    expect(final?.status).toBe('completed');
  });
});
