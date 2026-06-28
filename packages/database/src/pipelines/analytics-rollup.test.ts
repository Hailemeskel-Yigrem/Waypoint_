import { describe, expect, it, vi } from 'vitest';
import { refreshAnalyticsRollup } from './analytics-rollup.js';
import type { DatabaseClient } from '../client.js';

describe('analytics rollup pipeline', () => {
  it('validates the business date before querying', async () => {
    const db: DatabaseClient = { query: vi.fn(), close: vi.fn() };

    await expect(
      refreshAnalyticsRollup(db, { organizationId: 'org-1', date: '07/01/2026' }),
    ).rejects.toThrow('date must use YYYY-MM-DD');
    expect(db.query).not.toHaveBeenCalled();
  });

  it('maps the persisted daily result', async () => {
    const db: DatabaseClient = {
      query: vi.fn().mockResolvedValue({
        rowCount: 1,
        rows: [
          {
            org_id: '11111111-1111-1111-1111-111111111111',
            date: '2026-06-27',
            bookings_count: 3,
            visitors_count: 2,
            occupancy_rate: '50.00',
            revenue_cents: 12000,
          },
        ],
      }),
      close: vi.fn(),
    };

    await expect(
      refreshAnalyticsRollup(db, {
        organizationId: '11111111-1111-1111-1111-111111111111',
        date: '2026-06-27',
      }),
    ).resolves.toEqual({
      organizationId: '11111111-1111-1111-1111-111111111111',
      date: '2026-06-27',
      bookingsCount: 3,
      visitorsCount: 2,
      occupancyRate: 50,
      revenueCents: 12000,
    });
  });
});
