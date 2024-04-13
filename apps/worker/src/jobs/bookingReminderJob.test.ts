import { describe, it, expect, vi } from 'vitest';
import { bookingReminderJob } from './bookingReminderJob.js';

describe('bookingReminderJob', () => {
  it('processes a valid payload', async () => {
    const logger = { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() };
    const metrics = { increment: vi.fn(async () => undefined) };
    await bookingReminderJob.handle({ organizationId: 'org-1', referenceId: 'ref-1' }, {
      logger,
      metrics,
    } as any);
    expect(metrics.increment).toHaveBeenCalled();
  });

  it('rejects missing organizationId', async () => {
    await expect(
      bookingReminderJob.handle(
        { organizationId: '', referenceId: 'x' } as any,
        {
          logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
          metrics: { increment: vi.fn() },
        } as any,
      ),
    ).rejects.toThrow(/organizationId/);
  });
});
