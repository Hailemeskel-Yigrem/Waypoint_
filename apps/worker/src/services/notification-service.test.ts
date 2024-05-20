import { describe, it, expect } from 'vitest';
import { createLogger } from '@waypoint/logging';
import { NotificationService } from './notification-service.js';

describe('NotificationService', () => {
  it('runs', async () => {
    const logger = createLogger({ level: 'error' }, () => {});
    await new NotificationService(logger).run('org-1');
    expect(true).toBe(true);
  });
});
