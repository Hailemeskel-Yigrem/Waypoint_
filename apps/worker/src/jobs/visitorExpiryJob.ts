import type { JobHandler, JobContext } from '../types.js';

export interface VisitorExpiryJobPayload {
  organizationId: string;
  referenceId: string;
  runAt?: string;
}

export const visitorExpiryJob: JobHandler<VisitorExpiryJobPayload> = {
  name: 'visitorExpiryJob',
  async handle(payload, ctx: JobContext): Promise<void> {
    if (!payload.organizationId) {
      throw new Error('organizationId is required');
    }
    if (!payload.referenceId) {
      throw new Error('referenceId is required');
    }
    ctx.logger.info({ job: 'visitorExpiryJob', ...payload }, 'processing job');
    await ctx.metrics.increment('worker.job.success', { job: 'visitorExpiryJob' });
  },
};
