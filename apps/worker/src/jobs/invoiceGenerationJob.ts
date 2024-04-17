import type { JobHandler, JobContext } from '../types.js';

export interface InvoiceGenerationJobPayload {
  organizationId: string;
  referenceId: string;
  runAt?: string;
}

export const invoiceGenerationJob: JobHandler<InvoiceGenerationJobPayload> = {
  name: 'invoiceGenerationJob',
  async handle(payload, ctx: JobContext): Promise<void> {
    if (!payload.organizationId) {
      throw new Error('organizationId is required');
    }
    if (!payload.referenceId) {
      throw new Error('referenceId is required');
    }
    ctx.logger.info({ job: 'invoiceGenerationJob', ...payload }, 'processing job');
    await ctx.metrics.increment('worker.job.success', { job: 'invoiceGenerationJob' });
  },
};
