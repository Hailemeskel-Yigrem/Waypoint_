import Redis from 'ioredis';
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

  async add<T extends JobData>(
    name: string,
    data: T,
    opts?: { delayMs?: number; maxAttempts?: number },
  ): Promise<Job<T>> {
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
    await this.redis.set(`${JOB_PREFIX}${job.id}`, JSON.stringify(job));
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
    const raw = await this.redis.get(`${JOB_PREFIX}${id}`);
    return raw ? (JSON.parse(raw) as Job) : null;
  }

  async getStats() {
    const keys = await this.redis.keys(`${JOB_PREFIX}*`);
    const jobs = await Promise.all(
      keys.map(async (k) => JSON.parse((await this.redis.get(k))!) as Job),
    );
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
      const raw = await this.redis.get(`${JOB_PREFIX}${jobId}`);
      if (!raw) continue;
      const job = JSON.parse(raw) as Job;
      const handler = this.handlers.get(job.name);
      if (!handler) {
        await this.redis.lpush(QUEUE_KEY, jobId);
        continue;
      }
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
      await this.redis.set(`${JOB_PREFIX}${jobId}`, JSON.stringify(job));
    }
  }
}
