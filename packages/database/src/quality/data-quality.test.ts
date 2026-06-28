import { describe, expect, it, vi } from 'vitest';
import { assertDatabaseQuality, runDataQualityChecks } from './data-quality.js';
import type { DatabaseClient } from '../client.js';

function databaseWithCounts(counts: number[]): DatabaseClient {
  const query = vi.fn();
  for (const violations of counts) {
    query.mockResolvedValueOnce({ rows: [{ violations }], rowCount: 1 });
  }
  return { query, close: vi.fn() };
}

describe('database quality checks', () => {
  it('reports each invariant independently', async () => {
    const results = await runDataQualityChecks(databaseWithCounts([0, 2, 0, 1]));

    expect(results).toEqual([
      expect.objectContaining({ name: 'users_reference_existing_organizations', passed: true }),
      expect.objectContaining({
        name: 'bookings_reference_existing_tenants_and_users',
        violations: 2,
        passed: false,
      }),
      expect.objectContaining({ name: 'bookings_have_positive_duration', passed: true }),
      expect.objectContaining({
        name: 'analytics_rollups_stay_in_valid_ranges',
        violations: 1,
        passed: false,
      }),
    ]);
  });

  it('fails the gate with the names and counts of broken invariants', async () => {
    await expect(assertDatabaseQuality(databaseWithCounts([0, 1, 0, 3]))).rejects.toThrow(
      'bookings_reference_existing_tenants_and_users: 1',
    );
  });
});
