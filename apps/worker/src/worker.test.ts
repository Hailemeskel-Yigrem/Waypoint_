import { describe, it, expect } from 'vitest';
import { createQueueAdapter } from './worker.js';

describe('worker', () => {
  it('creates memory adapter by default', () => {
    const adapter = createQueueAdapter({
      WORKER_QUEUE_ADAPTER: 'memory',
      WORKER_POLL_INTERVAL_MS: 1000,
      WORKER_CONCURRENCY: 5,
      NODE_ENV: 'test',
      LOG_LEVEL: 'error',
    } as any);
    expect(adapter).toBeDefined();
  });
});
