import { z } from 'zod';
import { baseEnvSchema } from './base.js';

export const workerEnvSchema = baseEnvSchema.extend({
  WORKER_CONCURRENCY: z.coerce.number().int().min(1).max(100).default(5),
  WORKER_QUEUE_ADAPTER: z.enum(['memory', 'redis']).default('memory'),
  WORKER_POLL_INTERVAL_MS: z.coerce.number().int().min(100).default(1000),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().optional(),
  SMTP_FROM: z.string().email().optional(),
});

export type WorkerEnv = z.infer<typeof workerEnvSchema>;

export const workerDefaults: Partial<WorkerEnv> = {
  WORKER_CONCURRENCY: 5,
  WORKER_QUEUE_ADAPTER: 'memory',
  WORKER_POLL_INTERVAL_MS: 1000,
};
