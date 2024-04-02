import type { Job } from '../../queue/types.js';
import type { AnalyticsRollupJobData } from './types.js';
import type { Logger } from '@waypoint/logging';

export async function handleAnalyticsRollup(
  job: Job<AnalyticsRollupJobData>,
  logger: Logger,
): Promise<void> {
  const { orgId, date } = job.data;
  logger.info('Rolling up analytics', { orgId, date });
}
