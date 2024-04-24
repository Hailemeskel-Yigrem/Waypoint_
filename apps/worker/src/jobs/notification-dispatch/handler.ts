import type { Job } from '../../queue/types.js';
import type { NotificationDispatchJobData } from './types.js';
import type { Logger } from '@waypoint/logging';

export async function handleNotificationDispatch(
  job: Job<NotificationDispatchJobData>,
  logger: Logger,
): Promise<void> {
  const { channel, subject, userId } = job.data;
  logger.info('Dispatching notification', { channel, subject, userId });
}
