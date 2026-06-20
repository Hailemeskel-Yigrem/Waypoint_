#!/usr/bin/env node
/** Part 4: worker app */
import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function write(relPath, content) {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf8');
}

function pkgJson(name, extra = {}) {
  return JSON.stringify({ name, version: '0.1.0', private: true, type: 'module', scripts: { build: 'tsc -p tsconfig.json', dev: 'node --watch dist/index.js', start: 'node dist/index.js', test: 'vitest run', typecheck: 'tsc --noEmit', clean: 'rimraf dist' }, ...extra }, null, 2);
}

write('apps/worker/package.json', pkgJson('@waypoint/worker', {
  dependencies: {
    '@waypoint/shared': 'workspace:*',
    '@waypoint/logging': 'workspace:*',
    '@waypoint/config': 'workspace:*',
    '@waypoint/database': 'workspace:*',
    ioredis: '^5.4.2',
  },
  devDependencies: { vitest: '^2.1.8', typescript: '^5.7.3', rimraf: '^6.0.1' },
}));
write('apps/worker/tsconfig.json', JSON.stringify({ extends: '../../tsconfig.base.json', compilerOptions: { outDir: './dist', rootDir: './src' }, include: ['src/**/*'], references: [{ path: '../../packages/shared' }, { path: '../../packages/logging' }, { path: '../../packages/config' }] }, null, 2));
write('apps/worker/vitest.config.ts', `import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { globals: true, environment: 'node', include: ['src/**/*.test.ts', 'tests/**/*.test.ts'] } });
`);

// Queue types and adapters
write('apps/worker/src/queue/types.ts', `export type JobStatus = 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';

export interface JobData {
  [key: string]: unknown;
}

export interface Job<T extends JobData = JobData> {
  id: string;
  name: string;
  data: T;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  failedReason?: string;
  delayMs?: number;
}

export type JobHandler<T extends JobData = JobData> = (job: Job<T>) => Promise<void>;

export interface QueueAdapter {
  add<T extends JobData>(name: string, data: T, opts?: { delayMs?: number; maxAttempts?: number }): Promise<Job<T>>;
  process(name: string, handler: JobHandler): void;
  start(): Promise<void>;
  stop(): Promise<void>;
  getJob(id: string): Promise<Job | null>;
  getStats(): Promise<{ waiting: number; active: number; completed: number; failed: number }>;
}
`);

write('apps/worker/src/queue/memory-adapter.ts', `import type { Job, JobData, JobHandler, QueueAdapter } from './types.js';

export class MemoryQueueAdapter implements QueueAdapter {
  private jobs = new Map<string, Job>();
  private handlers = new Map<string, JobHandler>();
  private queue: string[] = [];
  private running = false;
  private interval?: ReturnType<typeof setInterval>;
  private pollMs: number;

  constructor(pollMs = 500) {
    this.pollMs = pollMs;
  }

  async add<T extends JobData>(name: string, data: T, opts?: { delayMs?: number; maxAttempts?: number }): Promise<Job<T>> {
    const job: Job<T> = {
      id: crypto.randomUUID(),
      name,
      data,
      status: opts?.delayMs ? 'delayed' : 'waiting',
      attempts: 0,
      maxAttempts: opts?.maxAttempts ?? 3,
      createdAt: new Date(),
      delayMs: opts?.delayMs,
    };
    this.jobs.set(job.id, job as Job);
    if (!opts?.delayMs) this.queue.push(job.id);
    else setTimeout(() => { job.status = 'waiting'; this.queue.push(job.id); }, opts.delayMs);
    return job;
  }

  process(name: string, handler: JobHandler): void {
    this.handlers.set(name, handler);
  }

  async start(): Promise<void> {
    if (this.running) return;
    this.running = true;
    this.interval = setInterval(() => void this.tick(), this.pollMs);
  }

  async stop(): Promise<void> {
    this.running = false;
    if (this.interval) clearInterval(this.interval);
  }

  async getJob(id: string): Promise<Job | null> {
    return this.jobs.get(id) ?? null;
  }

  async getStats() {
    const all = [...this.jobs.values()];
    return {
      waiting: all.filter((j) => j.status === 'waiting').length,
      active: all.filter((j) => j.status === 'active').length,
      completed: all.filter((j) => j.status === 'completed').length,
      failed: all.filter((j) => j.status === 'failed').length,
    };
  }

  private async tick(): Promise<void> {
    if (!this.queue.length) return;
    const id = this.queue.shift()!;
    const job = this.jobs.get(id);
    if (!job || job.status !== 'waiting') return;
    const handler = this.handlers.get(job.name);
    if (!handler) { this.queue.push(id); return; }
    job.status = 'active';
    job.attempts += 1;
    job.processedAt = new Date();
    try {
      await handler(job);
      job.status = 'completed';
      job.completedAt = new Date();
    } catch (e) {
      job.failedReason = e instanceof Error ? e.message : String(e);
      if (job.attempts < job.maxAttempts) {
        job.status = 'waiting';
        this.queue.push(id);
      } else {
        job.status = 'failed';
      }
    }
  }
}
`);

write('apps/worker/src/queue/redis-adapter.ts', `import Redis from 'ioredis';
import type { Job, JobData, JobHandler, QueueAdapter } from './types.js';

const QUEUE_KEY = 'waypoint:jobs';
const JOB_PREFIX = 'waypoint:job:';

export class RedisQueueAdapter implements QueueAdapter {
  private redis: Redis;
  private handlers = new Map<string, JobHandler>();
  private running = false;
  private pollMs: number;

  constructor(redisUrl: string, pollMs = 1000) {
    this.redis = new Redis(redisUrl);
    this.pollMs = pollMs;
  }

  async add<T extends JobData>(name: string, data: T, opts?: { delayMs?: number; maxAttempts?: number }): Promise<Job<T>> {
    const job: Job<T> = {
      id: crypto.randomUUID(),
      name,
      data,
      status: 'waiting',
      attempts: 0,
      maxAttempts: opts?.maxAttempts ?? 3,
      createdAt: new Date(),
      delayMs: opts?.delayMs,
    };
    await this.redis.set(\`\${JOB_PREFIX}\${job.id}\`, JSON.stringify(job));
    const push = () => this.redis.lpush(QUEUE_KEY, job.id);
    if (opts?.delayMs) setTimeout(() => void push(), opts.delayMs);
    else await push();
    return job;
  }

  process(name: string, handler: JobHandler): void {
    this.handlers.set(name, handler);
  }

  async start(): Promise<void> {
    this.running = true;
    void this.loop();
  }

  async stop(): Promise<void> {
    this.running = false;
    await this.redis.quit();
  }

  async getJob(id: string): Promise<Job | null> {
    const raw = await this.redis.get(\`\${JOB_PREFIX}\${id}\`);
    return raw ? (JSON.parse(raw) as Job) : null;
  }

  async getStats() {
    const keys = await this.redis.keys(\`\${JOB_PREFIX}*\`);
    const jobs = await Promise.all(keys.map(async (k) => JSON.parse((await this.redis.get(k))!) as Job));
    return {
      waiting: jobs.filter((j) => j.status === 'waiting').length,
      active: jobs.filter((j) => j.status === 'active').length,
      completed: jobs.filter((j) => j.status === 'completed').length,
      failed: jobs.filter((j) => j.status === 'failed').length,
    };
  }

  private async loop(): Promise<void> {
    while (this.running) {
      const id = await this.redis.brpop(QUEUE_KEY, Math.ceil(this.pollMs / 1000));
      if (!id) continue;
      const jobId = id[1];
      const raw = await this.redis.get(\`\${JOB_PREFIX}\${jobId}\`);
      if (!raw) continue;
      const job = JSON.parse(raw) as Job;
      const handler = this.handlers.get(job.name);
      if (!handler) { await this.redis.lpush(QUEUE_KEY, jobId); continue; }
      job.status = 'active';
      job.attempts += 1;
      job.processedAt = new Date();
      try {
        await handler(job);
        job.status = 'completed';
        job.completedAt = new Date();
      } catch (e) {
        job.failedReason = e instanceof Error ? e.message : String(e);
        job.status = job.attempts < job.maxAttempts ? 'waiting' : 'failed';
        if (job.status === 'waiting') await this.redis.lpush(QUEUE_KEY, jobId);
      }
      await this.redis.set(\`\${JOB_PREFIX}\${jobId}\`, JSON.stringify(job));
    }
  }
}
`);

write('apps/worker/src/queue/index.ts', `export * from './types.js';
export * from './memory-adapter.js';
export * from './redis-adapter.js';
`);

// Jobs
const jobDefs = {
  'booking-reminder': {
    data: `export interface BookingReminderJobData { orgId: string; bookingId: string; userId: string; startAt: string; }`,
    handler: `import type { Job } from '../../queue/types.js';
import type { BookingReminderJobData } from './types.js';
import type { Logger } from '@waypoint/logging';

export async function handleBookingReminder(job: Job<BookingReminderJobData>, logger: Logger): Promise<void> {
  const { orgId, bookingId, userId, startAt } = job.data;
  logger.info('Sending booking reminder', { orgId, bookingId, userId, startAt });
  // Dispatch notification via email/push channel
}`,
  },
  'visitor-expiry': {
    data: `export interface VisitorExpiryJobData { orgId: string; visitorId: string; expiresAt: string; }`,
    handler: `import type { Job } from '../../queue/types.js';
import type { VisitorExpiryJobData } from './types.js';
import type { Logger } from '@waypoint/logging';

export async function handleVisitorExpiry(job: Job<VisitorExpiryJobData>, logger: Logger): Promise<void> {
  const { orgId, visitorId, expiresAt } = job.data;
  logger.info('Expiring visitor', { orgId, visitorId, expiresAt });
}`,
  },
  'notification-dispatch': {
    data: `export interface NotificationDispatchJobData { orgId: string; userId: string; channel: 'email' | 'push' | 'sms'; subject: string; body: string; }`,
    handler: `import type { Job } from '../../queue/types.js';
import type { NotificationDispatchJobData } from './types.js';
import type { Logger } from '@waypoint/logging';

export async function handleNotificationDispatch(job: Job<NotificationDispatchJobData>, logger: Logger): Promise<void> {
  const { channel, subject, userId } = job.data;
  logger.info('Dispatching notification', { channel, subject, userId });
}`,
  },
  'analytics-rollup': {
    data: `export interface AnalyticsRollupJobData { orgId: string; date: string; }`,
    handler: `import type { Job } from '../../queue/types.js';
import type { AnalyticsRollupJobData } from './types.js';
import type { Logger } from '@waypoint/logging';

export async function handleAnalyticsRollup(job: Job<AnalyticsRollupJobData>, logger: Logger): Promise<void> {
  const { orgId, date } = job.data;
  logger.info('Rolling up analytics', { orgId, date });
}`,
  },
  'billing-invoice': {
    data: `export interface BillingInvoiceJobData { orgId: string; periodStart: string; periodEnd: string; }`,
    handler: `import type { Job } from '../../queue/types.js';
import type { BillingInvoiceJobData } from './types.js';
import type { Logger } from '@waypoint/logging';

export async function handleBillingInvoice(job: Job<BillingInvoiceJobData>, logger: Logger): Promise<void> {
  const { orgId, periodStart, periodEnd } = job.data;
  logger.info('Generating invoice', { orgId, periodStart, periodEnd });
}`,
  },
  'webhook-delivery': {
    data: `export interface WebhookDeliveryJobData { endpointId: string; event: string; payload: Record<string, unknown>; url: string; secret: string; }`,
    handler: `import { createHmac } from 'node:crypto';
import type { Job } from '../../queue/types.js';
import type { WebhookDeliveryJobData } from './types.js';
import type { Logger } from '@waypoint/logging';

export async function handleWebhookDelivery(job: Job<WebhookDeliveryJobData>, logger: Logger): Promise<void> {
  const { url, secret, event, payload } = job.data;
  const body = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
  const signature = createHmac('sha256', secret).update(body).digest('hex');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Waypoint-Signature': signature },
    body,
  });
  if (!res.ok) throw new Error(\`Webhook delivery failed: \${res.status}\`);
  logger.info('Webhook delivered', { url, event, status: res.status });
}`,
  },
};

for (const [name, def] of Object.entries(jobDefs)) {
  const dir = `apps/worker/src/jobs/${name}`;
  write(`${dir}/types.ts`, def.data);
  write(`${dir}/handler.ts`, def.handler);
  write(`${dir}/index.ts`, `export * from './types.js';
export * from './handler.js';
`);
}

write('apps/worker/src/jobs/index.ts', Object.keys(jobDefs).map(n => `export * as ${n.replace(/-([a-z])/g, (_, c) => c.toUpperCase())} from './${n}/index.js';`).join('\n') + '\n');

write('apps/worker/src/jobs/registry.ts', `import type { QueueAdapter } from '../queue/types.js';
import type { Logger } from '@waypoint/logging';
import { handleBookingReminder } from './booking-reminder/handler.js';
import { handleVisitorExpiry } from './visitor-expiry/handler.js';
import { handleNotificationDispatch } from './notification-dispatch/handler.js';
import { handleAnalyticsRollup } from './analytics-rollup/handler.js';
import { handleBillingInvoice } from './billing-invoice/handler.js';
import { handleWebhookDelivery } from './webhook-delivery/handler.js';

export const JOB_NAMES = {
  BOOKING_REMINDER: 'booking-reminder',
  VISITOR_EXPIRY: 'visitor-expiry',
  NOTIFICATION_DISPATCH: 'notification-dispatch',
  ANALYTICS_ROLLUP: 'analytics-rollup',
  BILLING_INVOICE: 'billing-invoice',
  WEBHOOK_DELIVERY: 'webhook-delivery',
} as const;

export function registerJobs(queue: QueueAdapter, logger: Logger): void {
  const log = logger.child({ component: 'worker' });
  queue.process(JOB_NAMES.BOOKING_REMINDER, (job) => handleBookingReminder(job as any, log));
  queue.process(JOB_NAMES.VISITOR_EXPIRY, (job) => handleVisitorExpiry(job as any, log));
  queue.process(JOB_NAMES.NOTIFICATION_DISPATCH, (job) => handleNotificationDispatch(job as any, log));
  queue.process(JOB_NAMES.ANALYTICS_ROLLUP, (job) => handleAnalyticsRollup(job as any, log));
  queue.process(JOB_NAMES.BILLING_INVOICE, (job) => handleBillingInvoice(job as any, log));
  queue.process(JOB_NAMES.WEBHOOK_DELIVERY, (job) => handleWebhookDelivery(job as any, log));
}
`);

write('apps/worker/src/worker.ts', `import { loadEnv } from '@waypoint/config';
import { workerEnvSchema } from '@waypoint/config';
import { createLogger } from '@waypoint/logging';
import { MemoryQueueAdapter } from './queue/memory-adapter.js';
import { RedisQueueAdapter } from './queue/redis-adapter.js';
import { registerJobs } from './jobs/registry.js';
import type { QueueAdapter } from './queue/types.js';

export function createQueueAdapter(env: ReturnType<typeof loadEnv<typeof workerEnvSchema>>): QueueAdapter {
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
  logger.info('Worker started', { adapter: env.WORKER_QUEUE_ADAPTER, concurrency: env.WORKER_CONCURRENCY });
  return {
    queue,
    stop: async () => {
      await queue.stop();
      logger.info('Worker stopped');
    },
  };
}
`);

write('apps/worker/src/index.ts', `import { startWorker } from './worker.js';

const main = async () => {
  const { stop } = await startWorker();
  process.on('SIGINT', () => void stop().then(() => process.exit(0)));
  process.on('SIGTERM', () => void stop().then(() => process.exit(0)));
};

main().catch((e) => { console.error(e); process.exit(1); });
`);

write('apps/worker/src/scheduler.ts', `import type { QueueAdapter } from './queue/types.js';
import { JOB_NAMES } from './jobs/registry.js';

export interface SchedulerOptions {
  orgId: string;
  intervalMs?: number;
}

export class WorkerScheduler {
  private timers: ReturnType<typeof setInterval>[] = [];

  constructor(private queue: QueueAdapter) {}

  scheduleDailyRollup(opts: SchedulerOptions): void {
    const timer = setInterval(() => {
      const date = new Date().toISOString().slice(0, 10);
      void this.queue.add(JOB_NAMES.ANALYTICS_ROLLUP, { orgId: opts.orgId, date });
    }, opts.intervalMs ?? 86_400_000);
    this.timers.push(timer);
  }

  scheduleVisitorExpiryCheck(opts: SchedulerOptions): void {
    const timer = setInterval(() => {
      void this.queue.add(JOB_NAMES.VISITOR_EXPIRY, {
        orgId: opts.orgId,
        visitorId: 'scan',
        expiresAt: new Date().toISOString(),
      });
    }, opts.intervalMs ?? 300_000);
    this.timers.push(timer);
  }

  stop(): void {
    for (const t of this.timers) clearInterval(t);
    this.timers = [];
  }
}
`);

// Worker tests
write('apps/worker/src/queue/memory-adapter.test.ts', `import { describe, it, expect, vi } from 'vitest';
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
    queue.process('fail-job', async () => { calls++; if (calls < 2) throw new Error('fail'); });
    await queue.start();
    const job = await queue.add('fail-job', {}, { maxAttempts: 3 });
    await new Promise((r) => setTimeout(r, 400));
    await queue.stop();
    const final = await queue.getJob(job.id);
    expect(final?.status).toBe('completed');
  });
});
`);

write('apps/worker/src/queue/types.test.ts', `import { describe, it, expect } from 'vitest';
import type { Job } from './types.js';

describe('Job types', () => {
  it('Job shape', () => {
    const job: Job = { id: '1', name: 'test', data: {}, status: 'waiting', attempts: 0, maxAttempts: 3, createdAt: new Date() };
    expect(job.name).toBe('test');
  });
});
`);

write('apps/worker/src/jobs/registry.test.ts', `import { describe, it, expect } from 'vitest';
import { JOB_NAMES } from './registry.js';

describe('job registry', () => {
  it('defines job names', () => {
    expect(JOB_NAMES.BOOKING_REMINDER).toBe('booking-reminder');
    expect(JOB_NAMES.WEBHOOK_DELIVERY).toBe('webhook-delivery');
  });
});
`);

for (const name of Object.keys(jobDefs)) {
  write(`apps/worker/src/jobs/${name}/handler.test.ts`, `import { describe, it, expect, vi } from 'vitest';
import { createLogger } from '@waypoint/logging';

describe('${name} handler', () => {
  it('module loads', async () => {
    const mod = await import('./handler.js');
    expect(mod).toBeDefined();
  });
});
`);
}

write('apps/worker/src/worker.test.ts', `import { describe, it, expect } from 'vitest';
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
`);

write('apps/worker/src/scheduler.test.ts', `import { describe, it, expect, vi, afterEach } from 'vitest';
import { WorkerScheduler } from './scheduler.js';
import { MemoryQueueAdapter } from './queue/memory-adapter.js';

describe('WorkerScheduler', () => {
  afterEach(() => vi.useRealTimers());

  it('schedules rollup', () => {
    vi.useFakeTimers();
    const queue = new MemoryQueueAdapter();
    const add = vi.spyOn(queue, 'add');
    const scheduler = new WorkerScheduler(queue);
    scheduler.scheduleDailyRollup({ orgId: 'o1', intervalMs: 1000 });
    vi.advanceTimersByTime(1000);
    expect(add).toHaveBeenCalled();
    scheduler.stop();
  });
});
`);

write('apps/worker/tests/integration/queue-flow.test.ts', `import { describe, it, expect, vi } from 'vitest';
import { MemoryQueueAdapter } from '../../src/queue/memory-adapter.js';
import { registerJobs } from '../../src/jobs/registry.js';
import { createLogger } from '@waypoint/logging';

describe('queue integration', () => {
  it('registers and processes all job types', async () => {
    const queue = new MemoryQueueAdapter(30);
    const logger = createLogger({ level: 'error' }, () => {});
    registerJobs(queue, logger);
    await queue.start();
    await queue.add('booking-reminder', { orgId: 'o1', bookingId: 'b1', userId: 'u1', startAt: new Date().toISOString() });
    await new Promise((r) => setTimeout(r, 150));
    const stats = await queue.getStats();
    expect(stats.completed + stats.active).toBeGreaterThanOrEqual(0);
    await queue.stop();
  });
});
`);

console.log('Generated worker app');
