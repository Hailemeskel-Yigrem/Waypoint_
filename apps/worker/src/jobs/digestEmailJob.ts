import type { JobHandler, JobContext } from '../types.js';

export interface DigestEmailJobPayload {
  organizationId: string;
  referenceId: string;
  runAt?: string;
}

export const digestEmailJob: JobHandler<DigestEmailJobPayload> = {
  name: 'digestEmailJob',
  async handle(payload, ctx: JobContext): Promise<void> {
    if (!payload.organizationId) {
      throw new Error('organizationId is required');
    }
    if (!payload.referenceId) {
      throw new Error('referenceId is required');
    }
    ctx.logger.info({ job: 'digestEmailJob', ...payload }, 'processing job');
    await ctx.metrics.increment('worker.job.success', { job: 'digestEmailJob' });
  },
};
