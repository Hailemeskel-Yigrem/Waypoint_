import type { QueueAdapter } from './queue/types.js';
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
