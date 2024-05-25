import { loadEnv } from '@waypoint/config';
import { workerEnvSchema } from '@waypoint/config';
import { createLogger } from '@waypoint/logging';
import { MemoryQueueAdapter } from './queue/memory-adapter.js';
import { RedisQueueAdapter } from './queue/redis-adapter.js';
import { registerJobs } from './jobs/registry.js';
import type { QueueAdapter } from './queue/types.js';

export function createQueueAdapter(
  env: ReturnType<typeof loadEnv<typeof workerEnvSchema>>,
): QueueAdapter {
  if (env.WORKER_QUEUE_ADAPTER === 'redis' && env.REDIS_URL) {
    return new RedisQueueAdapter(env.REDIS_URL, env.WORKER_POLL_INTERVAL_MS);
  }
  return new MemoryQueueAdapter(env.WORKER_POLL_INTERVAL_MS);
}

export async function startWorker(): Promise<{ queue: QueueAdapter; stop: () => Promise<void> }> {
  const env = loadEnv(workerEnvSchema);
  const logger = createLogger({ service: 'waypoint-worker', level: env.LOG_LEVEL as any });
  const queue = createQueueAdapter(env);
  registerJobs(queue, logger);
  await queue.start();
  logger.info('Worker started', {
    adapter: env.WORKER_QUEUE_ADAPTER,
    concurrency: env.WORKER_CONCURRENCY,
  });
  return {
    queue,
    stop: async () => {
      await queue.stop();
      logger.info('Worker stopped');
    },
  };
}
