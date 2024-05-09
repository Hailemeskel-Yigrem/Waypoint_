import type { JobHandler, JobContext } from '../types.js';

export interface WebhookDeliveryJobPayload {
  organizationId: string;
  referenceId: string;
  runAt?: string;
}

export const webhookDeliveryJob: JobHandler<WebhookDeliveryJobPayload> = {
  name: 'webhookDeliveryJob',
  async handle(payload, ctx: JobContext): Promise<void> {
    if (!payload.organizationId) {
      throw new Error('organizationId is required');
    }
    if (!payload.referenceId) {
      throw new Error('referenceId is required');
    }
    ctx.logger.info({ job: 'webhookDeliveryJob', ...payload }, 'processing job');
    await ctx.metrics.increment('worker.job.success', { job: 'webhookDeliveryJob' });
  },
};
