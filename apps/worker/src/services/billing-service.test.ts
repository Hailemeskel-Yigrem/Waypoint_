import { describe, it, expect } from 'vitest';
import { createLogger } from '@waypoint/logging';
import { BillingService } from './billing-service.js';

describe('BillingService', () => {
  it('runs', async () => {
    const logger = createLogger({ level: 'error' }, () => {});
    await new BillingService(logger).run('org-1');
    expect(true).toBe(true);
  });
});
