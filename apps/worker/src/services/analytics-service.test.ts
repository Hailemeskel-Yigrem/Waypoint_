import { describe, it, expect } from 'vitest';
import { createLogger } from '@waypoint/logging';
import { AnalyticsService } from './analytics-service.js';

describe('AnalyticsService', () => {
  it('runs', async () => {
    const logger = createLogger({ level: 'error' }, () => {});
    await new AnalyticsService(logger).run('org-1');
    expect(true).toBe(true);
  });
});
