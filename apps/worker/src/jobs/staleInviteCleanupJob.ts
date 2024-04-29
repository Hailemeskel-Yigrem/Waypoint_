import type { JobHandler, JobContext } from '../types.js';

export interface StaleInviteCleanupJobPayload {
  organizationId: string;
  referenceId: string;
  runAt?: string;
}

export const staleInviteCleanupJob: JobHandler<StaleInviteCleanupJobPayload> = {
  name: 'staleInviteCleanupJob',
  async handle(payload, ctx: JobContext): Promise<void> {
    if (!payload.organizationId) {
      throw new Error('organizationId is required');
    }
    if (!payload.referenceId) {
      throw new Error('referenceId is required');
    }
    ctx.logger.info({ job: 'staleInviteCleanupJob', ...payload }, 'processing job');
    await ctx.metrics.increment('worker.job.success', { job: 'staleInviteCleanupJob' });
  },
};
