import { describe, it, expect } from 'vitest';
import { WebhookService, MemoryWebhookRepository } from '@waypoint/domain';

describe('api webhooks wiring', () => {
  it('creates via domain service', async () => {
    const service = new WebhookService(new MemoryWebhookRepository());
    const result = await service.create({
      organizationId: '11111111-1111-1111-1111-111111111111',
      name: 'API Webhook',
    });
    expect(result.ok).toBe(true);
  });
});
