import type { QueueAdapter } from '../queue/types.js';
import type { Logger } from '@waypoint/logging';
import { handleBookingReminder } from './booking-reminder/handler.js';
import { handleVisitorExpiry } from './visitor-expiry/handler.js';
import { handleNotificationDispatch } from './notification-dispatch/handler.js';
import { handleAnalyticsRollup } from './analytics-rollup/handler.js';
import { handleBillingInvoice } from './billing-invoice/handler.js';
import { handleWebhookDelivery } from './webhook-delivery/handler.js';

export const JOB_NAMES = {
  BOOKING_REMINDER: 'booking-reminder',
  VISITOR_EXPIRY: 'visitor-expiry',
  NOTIFICATION_DISPATCH: 'notification-dispatch',
  ANALYTICS_ROLLUP: 'analytics-rollup',
  BILLING_INVOICE: 'billing-invoice',
  WEBHOOK_DELIVERY: 'webhook-delivery',
} as const;

export function registerJobs(queue: QueueAdapter, logger: Logger): void {
  const log = logger.child({ component: 'worker' });
  queue.process(JOB_NAMES.BOOKING_REMINDER, (job) => handleBookingReminder(job as any, log));
  queue.process(JOB_NAMES.VISITOR_EXPIRY, (job) => handleVisitorExpiry(job as any, log));
  queue.process(JOB_NAMES.NOTIFICATION_DISPATCH, (job) =>
    handleNotificationDispatch(job as any, log),
  );
  queue.process(JOB_NAMES.ANALYTICS_ROLLUP, (job) => handleAnalyticsRollup(job as any, log));
  queue.process(JOB_NAMES.BILLING_INVOICE, (job) => handleBillingInvoice(job as any, log));
  queue.process(JOB_NAMES.WEBHOOK_DELIVERY, (job) => handleWebhookDelivery(job as any, log));
}
