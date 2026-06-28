import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type pg from 'pg';
import {
  assertDatabaseQuality,
  createPool,
  poolToClient,
  refreshAnalyticsRollup,
  runMigrations,
} from '../src/index.js';

const ORGANIZATION_ID = '11111111-1111-1111-1111-111111111111';
const USER_ID = '22222222-2222-2222-2222-222222222222';
const SPACE_ID = '33333333-3333-3333-3333-333333333333';
const DESK_ONE_ID = '44444444-4444-4444-4444-444444444441';
const DESK_TWO_ID = '44444444-4444-4444-4444-444444444442';
const TEST_DATE = '2026-06-27';

function testDatabaseUrl(): string {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error('TEST_DATABASE_URL is required for database integration tests');
  return url;
}

describe('PostgreSQL migrations and analytics pipeline', () => {
  let pool: pg.Pool;

  beforeAll(async () => {
    pool = createPool(testDatabaseUrl());
    await pool.query('DROP SCHEMA public CASCADE');
    await pool.query('CREATE SCHEMA public');
  });

  afterAll(async () => {
    await pool?.end();
  });

  it('applies the versioned migration set once and verifies checksums on retry', async () => {
    const first = await runMigrations(pool);
    const second = await runMigrations(pool);

    expect(first.applied).toHaveLength(14);
    expect(second).toEqual({ applied: [], skipped: first.applied });

    const ledger = await pool.query<{ count: number; checksummed: number }>(
      `SELECT COUNT(*)::int AS count,
              COUNT(checksum)::int AS checksummed
       FROM schema_migrations`,
    );
    expect(ledger.rows[0]).toEqual({ count: 14, checksummed: 14 });
  });

  it('enforces booking conflicts and builds an idempotent daily rollup', async () => {
    await pool.query(
      `INSERT INTO organizations (id, name, slug, plan, status)
       VALUES ($1, 'Integration Tenant', 'integration-tenant', 'starter', 'active')`,
      [ORGANIZATION_ID],
    );
    await pool.query(
      `INSERT INTO users (id, org_id, email, name, role, status)
       VALUES ($1, $2, 'owner@integration.test', 'Integration Owner', 'owner', 'active')`,
      [USER_ID, ORGANIZATION_ID],
    );
    await pool.query(
      `INSERT INTO spaces (id, org_id, name, slug, type, capacity)
       VALUES ($1, $2, 'North Floor', 'north-floor', 'office', 20)`,
      [SPACE_ID, ORGANIZATION_ID],
    );
    await pool.query(
      `INSERT INTO desks (id, org_id, space_id, label)
       VALUES ($1, $3, $2, 'N-01'), ($4, $3, $2, 'N-02')`,
      [DESK_ONE_ID, SPACE_ID, ORGANIZATION_ID, DESK_TWO_ID],
    );
    await pool.query(
      `INSERT INTO bookings (
         org_id, user_id, resource_type, resource_id, title, start_at, end_at
       ) VALUES ($1, $2, 'desk', $3, 'Morning focus', $4, $5)`,
      [
        ORGANIZATION_ID,
        USER_ID,
        DESK_ONE_ID,
        `${TEST_DATE}T09:00:00.000Z`,
        `${TEST_DATE}T10:00:00.000Z`,
      ],
    );

    await expect(
      pool.query(
        `INSERT INTO bookings (
           org_id, user_id, resource_type, resource_id, title, start_at, end_at
         ) VALUES ($1, $2, 'desk', $3, 'Overlapping focus', $4, $5)`,
        [
          ORGANIZATION_ID,
          USER_ID,
          DESK_ONE_ID,
          `${TEST_DATE}T09:30:00.000Z`,
          `${TEST_DATE}T10:30:00.000Z`,
        ],
      ),
    ).rejects.toMatchObject({ code: '23P01' });

    await pool.query(
      `INSERT INTO bookings (
         org_id, user_id, resource_type, resource_id, title, start_at, end_at
       ) VALUES ($1, $2, 'desk', $3, 'Adjacent focus', $4, $5)`,
      [
        ORGANIZATION_ID,
        USER_ID,
        DESK_ONE_ID,
        `${TEST_DATE}T10:00:00.000Z`,
        `${TEST_DATE}T11:00:00.000Z`,
      ],
    );
    await pool.query(
      `INSERT INTO visitors (
         org_id, host_user_id, name, expected_at, check_in_window_start,
         check_in_window_end, expires_at
       ) VALUES ($1, $2, 'Expected Visitor', $3, $4, $5, $6)`,
      [
        ORGANIZATION_ID,
        USER_ID,
        `${TEST_DATE}T12:00:00.000Z`,
        `${TEST_DATE}T11:30:00.000Z`,
        `${TEST_DATE}T12:30:00.000Z`,
        `${TEST_DATE}T14:00:00.000Z`,
      ],
    );
    await pool.query(
      `INSERT INTO invoices (
         org_id, number, status, period_start, period_end, subtotal_cents,
         total_cents, due_at, paid_at
       ) VALUES ($1, 'INV-INTEGRATION', 'paid', $2, $2, 12000, 12000, $3, $3)`,
      [ORGANIZATION_ID, TEST_DATE, `${TEST_DATE}T18:00:00.000Z`],
    );

    const db = poolToClient(pool);
    const first = await refreshAnalyticsRollup(db, {
      organizationId: ORGANIZATION_ID,
      date: TEST_DATE,
    });
    const second = await refreshAnalyticsRollup(db, {
      organizationId: ORGANIZATION_ID,
      date: TEST_DATE,
    });

    expect(first).toMatchObject({
      bookingsCount: 2,
      visitorsCount: 1,
      occupancyRate: 50,
      revenueCents: 12000,
    });
    expect(second).toEqual(first);

    const pipelineLedger = await pool.query<{ rows: number; run_count: number }>(
      `SELECT COUNT(*)::int AS rows, MAX(run_count)::int AS run_count
       FROM pipeline_runs
       WHERE pipeline_name = 'analytics_daily_rollup'`,
    );
    expect(pipelineLedger.rows[0]).toEqual({ rows: 1, run_count: 2 });

    const quality = await assertDatabaseQuality(db);
    expect(quality).toHaveLength(4);
    expect(quality.every((check) => check.passed)).toBe(true);
  });
});
