import type { JobHandler, JobContext } from '../types.js';

export interface CheckinNudgeJobPayload {
  organizationId: string;
  referenceId: string;
  runAt?: string;
}

export const checkinNudgeJob: JobHandler<CheckinNudgeJobPayload> = {
  name: 'checkinNudgeJob',
  async handle(payload, ctx: JobContext): Promise<void> {
    if (!payload.organizationId) {
      throw new Error('organizationId is required');
    }
    if (!payload.referenceId) {
      throw new Error('referenceId is required');
    }
    ctx.logger.info({ job: 'checkinNudgeJob', ...payload }, 'processing job');
    await ctx.metrics.increment('worker.job.success', { job: 'checkinNudgeJob' });
  },
};
