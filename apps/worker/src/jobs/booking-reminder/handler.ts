import type { Job } from '../../queue/types.js';
import type { BookingReminderJobData } from './types.js';
import type { Logger } from '@waypoint/logging';

export async function handleBookingReminder(
  job: Job<BookingReminderJobData>,
  logger: Logger,
): Promise<void> {
  const { orgId, bookingId, userId, startAt } = job.data;
  logger.info('Sending booking reminder', { orgId, bookingId, userId, startAt });
  // Dispatch notification via email/push channel
}
