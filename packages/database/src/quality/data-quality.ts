import type { DatabaseClient } from '../client.js';

export interface DataQualityCheck {
  name: string;
  violations: number;
  passed: boolean;
}

const checks = [
  {
    name: 'users_reference_existing_organizations',
    sql: `SELECT COUNT(*)::int AS violations
          FROM users u
          LEFT JOIN organizations o ON o.id = u.org_id
          WHERE o.id IS NULL`,
  },
  {
    name: 'bookings_reference_existing_tenants_and_users',
    sql: `SELECT COUNT(*)::int AS violations
          FROM bookings b
          LEFT JOIN organizations o ON o.id = b.org_id
          LEFT JOIN users u ON u.id = b.user_id AND u.org_id = b.org_id
          WHERE o.id IS NULL OR u.id IS NULL`,
  },
  {
    name: 'bookings_have_positive_duration',
    sql: `SELECT COUNT(*)::int AS violations
          FROM bookings
          WHERE start_at >= end_at`,
  },
  {
    name: 'analytics_rollups_stay_in_valid_ranges',
    sql: `SELECT COUNT(*)::int AS violations
          FROM analytics_rollups
          WHERE bookings_count < 0
             OR visitors_count < 0
             OR revenue_cents < 0
             OR occupancy_rate NOT BETWEEN 0 AND 100`,
  },
] as const;

export async function runDataQualityChecks(db: DatabaseClient): Promise<DataQualityCheck[]> {
  return Promise.all(
    checks.map(async (check) => {
      const result = await db.query<{ violations: number }>(check.sql);
      const violations = Number(result.rows[0]?.violations ?? 0);
      return { name: check.name, violations, passed: violations === 0 };
    }),
  );
}

export async function assertDatabaseQuality(db: DatabaseClient): Promise<DataQualityCheck[]> {
  const results = await runDataQualityChecks(db);
  const failures = results.filter((result) => !result.passed);
  if (failures.length) {
    const summary = failures.map(({ name, violations }) => `${name}: ${violations}`).join(', ');
    throw new Error(`Database quality checks failed: ${summary}`);
  }
  return results;
}
