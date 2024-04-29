import type { Job } from '../../queue/types.js';
import type { VisitorExpiryJobData } from './types.js';
import type { Logger } from '@waypoint/logging';

export async function handleVisitorExpiry(
  job: Job<VisitorExpiryJobData>,
  logger: Logger,
): Promise<void> {
  const { orgId, visitorId, expiresAt } = job.data;
  logger.info('Expiring visitor', { orgId, visitorId, expiresAt });
}
