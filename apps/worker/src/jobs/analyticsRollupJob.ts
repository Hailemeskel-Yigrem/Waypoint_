import type { JobHandler, JobContext } from '../types.js';

export interface AnalyticsRollupJobPayload {
  organizationId: string;
  referenceId: string;
  runAt?: string;
}

export const analyticsRollupJob: JobHandler<AnalyticsRollupJobPayload> = {
  name: 'analyticsRollupJob',
  async handle(payload, ctx: JobContext): Promise<void> {
    if (!payload.organizationId) {
      throw new Error('organizationId is required');
    }
    if (!payload.referenceId) {
      throw new Error('referenceId is required');
    }
    ctx.logger.info({ job: 'analyticsRollupJob', ...payload }, 'processing job');
    await ctx.metrics.increment('worker.job.success', { job: 'analyticsRollupJob' });
  },
};
