import { describe, it, expect } from 'vitest';
import { createLogger } from '@waypoint/logging';
import { WebhookService } from './webhook-service.js';

describe('WebhookService', () => {
  it('runs', async () => {
    const logger = createLogger({ level: 'error' }, () => {});
    await new WebhookService(logger).run('org-1');
    expect(true).toBe(true);
  });
});
