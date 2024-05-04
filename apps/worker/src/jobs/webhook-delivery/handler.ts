import { createHmac } from 'node:crypto';
import type { Job } from '../../queue/types.js';
import type { WebhookDeliveryJobData } from './types.js';
import type { Logger } from '@waypoint/logging';

export async function handleWebhookDelivery(
  job: Job<WebhookDeliveryJobData>,
  logger: Logger,
): Promise<void> {
  const { url, secret, event, payload } = job.data;
  const body = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
  const signature = createHmac('sha256', secret).update(body).digest('hex');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Waypoint-Signature': signature },
    body,
  });
  if (!res.ok) throw new Error(`Webhook delivery failed: ${res.status}`);
  logger.info('Webhook delivered', { url, event, status: res.status });
}
