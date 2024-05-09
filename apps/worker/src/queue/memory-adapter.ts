import type { Job, JobData, JobHandler, QueueAdapter } from './types.js';

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

  async add<T extends JobData>(
    name: string,
    data: T,
    opts?: { delayMs?: number; maxAttempts?: number },
  ): Promise<Job<T>> {
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
    else
      setTimeout(() => {
        job.status = 'waiting';
        this.queue.push(job.id);
      }, opts.delayMs);
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
    if (!handler) {
      this.queue.push(id);
      return;
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
      if (job.attempts < job.maxAttempts) {
        job.status = 'waiting';
        this.queue.push(id);
      } else {
        job.status = 'failed';
      }
    }
  }
}
