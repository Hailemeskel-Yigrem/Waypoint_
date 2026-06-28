import { describe, expect, it, vi } from 'vitest';
import type { Logger } from '@waypoint/logging';
import { handleAnalyticsRollup } from './handler.js';

function testLogger(): Logger {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    child: vi.fn(),
  };
}

describe('analytics-rollup handler', () => {
  it('runs the rollup and logs its measured result', async () => {
    const logger = testLogger();
    const run = vi.fn().mockResolvedValue({
      organizationId: 'org-1',
      date: '2026-06-27',
      bookingsCount: 4,
      visitorsCount: 2,
      occupancyRate: 75,
      revenueCents: 25000,
    });

    await handleAnalyticsRollup(
      {
        id: 'job-1',
        name: 'analytics-rollup',
        data: { orgId: 'org-1', date: '2026-06-27' },
        status: 'waiting',
        attempts: 0,
        maxAttempts: 3,
        createdAt: new Date('2026-06-27T00:00:00.000Z'),
      },
      logger,
      run,
    );

    expect(run).toHaveBeenCalledWith({ orgId: 'org-1', date: '2026-06-27' });
    expect(logger.info).toHaveBeenLastCalledWith(
      'Analytics rollup complete',
      expect.objectContaining({ bookingsCount: 4, occupancyRate: 75 }),
    );
  });

  it('rejects malformed scheduling data before running SQL', async () => {
    const run = vi.fn();

    await expect(
      handleAnalyticsRollup(
        {
          id: 'job-2',
          name: 'analytics-rollup',
          data: { orgId: 'org-1', date: 'tomorrow' },
          status: 'waiting',
          attempts: 0,
          maxAttempts: 3,
          createdAt: new Date('2026-06-27T00:00:00.000Z'),
        },
        testLogger(),
        run,
      ),
    ).rejects.toThrow('date must use YYYY-MM-DD');
    expect(run).not.toHaveBeenCalled();
  });
});
