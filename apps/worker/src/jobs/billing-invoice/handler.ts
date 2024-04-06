import type { Job } from '../../queue/types.js';
import type { BillingInvoiceJobData } from './types.js';
import type { Logger } from '@waypoint/logging';

export async function handleBillingInvoice(
  job: Job<BillingInvoiceJobData>,
  logger: Logger,
): Promise<void> {
  const { orgId, periodStart, periodEnd } = job.data;
  logger.info('Generating invoice', { orgId, periodStart, periodEnd });
}
