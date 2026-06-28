import type { DatabaseClient } from '../client.js';

export interface AnalyticsRollupInput {
  organizationId: string;
  date: string;
}

export interface AnalyticsRollupResult {
  organizationId: string;
  date: string;
  bookingsCount: number;
  visitorsCount: number;
  occupancyRate: number;
  revenueCents: number;
}

interface AnalyticsRollupRow {
  org_id: string;
  date: string;
  bookings_count: number;
  visitors_count: number;
  occupancy_rate: string;
  revenue_cents: number;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Rebuild one tenant/day rollup from source-of-truth tables. The upsert and run
 * ledger are one SQL statement, so retries are atomic and idempotent.
 */
export async function refreshAnalyticsRollup(
  db: DatabaseClient,
  input: AnalyticsRollupInput,
): Promise<AnalyticsRollupResult> {
  if (!input.organizationId) throw new Error('organizationId is required');
  if (!ISO_DATE.test(input.date)) throw new Error('date must use YYYY-MM-DD');

  const { rows } = await db.query<AnalyticsRollupRow>(
    `WITH tenant AS (
       SELECT timezone
       FROM organizations
       WHERE id = $1
     ),
     booking_stats AS (
       SELECT
         COUNT(*) FILTER (WHERE b.status <> 'cancelled')::int AS bookings_count,
         COUNT(DISTINCT b.resource_id) FILTER (
           WHERE b.resource_type = 'desk' AND b.status <> 'cancelled'
         )::int AS occupied_desks
       FROM bookings b
       CROSS JOIN tenant
       WHERE b.org_id = $1
         AND (b.start_at AT TIME ZONE tenant.timezone)::date = $2::date
     ),
     visitor_stats AS (
       SELECT COUNT(*)::int AS visitors_count
       FROM visitors v
       CROSS JOIN tenant
       WHERE v.org_id = $1
         AND (v.expected_at AT TIME ZONE tenant.timezone)::date = $2::date
     ),
     desk_stats AS (
       SELECT COUNT(*) FILTER (WHERE is_bookable AND is_active)::int AS desk_count
       FROM desks
       WHERE org_id = $1
     ),
     revenue_stats AS (
       SELECT COALESCE(SUM(total_cents) FILTER (WHERE status = 'paid'), 0)::int AS revenue_cents
       FROM invoices
       WHERE org_id = $1 AND $2::date BETWEEN period_start AND period_end
     ),
     upserted AS (
       INSERT INTO analytics_rollups (
         org_id, date, bookings_count, visitors_count, occupancy_rate, revenue_cents, refreshed_at
       )
       SELECT
         $1,
         $2::date,
         booking_stats.bookings_count,
         visitor_stats.visitors_count,
         CASE
           WHEN desk_stats.desk_count = 0 THEN 0
           ELSE ROUND(booking_stats.occupied_desks::numeric / desk_stats.desk_count * 100, 2)
         END,
         revenue_stats.revenue_cents,
         NOW()
       FROM booking_stats, visitor_stats, desk_stats, revenue_stats
       ON CONFLICT (org_id, date) DO UPDATE SET
         bookings_count = EXCLUDED.bookings_count,
         visitors_count = EXCLUDED.visitors_count,
         occupancy_rate = EXCLUDED.occupancy_rate,
         revenue_cents = EXCLUDED.revenue_cents,
         refreshed_at = NOW()
       RETURNING org_id, date, bookings_count, visitors_count, occupancy_rate, revenue_cents
     ),
     recorded AS (
       INSERT INTO pipeline_runs (
         pipeline_name, org_id, business_date, status, row_count, run_count, finished_at
       )
       SELECT 'analytics_daily_rollup', org_id, date, 'succeeded', 1, 1, NOW()
       FROM upserted
       ON CONFLICT (pipeline_name, org_id, business_date) DO UPDATE SET
         status = 'succeeded',
         row_count = EXCLUDED.row_count,
         run_count = pipeline_runs.run_count + 1,
         finished_at = NOW()
       RETURNING org_id
     )
     SELECT
       upserted.org_id,
       upserted.date::text AS date,
       upserted.bookings_count,
       upserted.visitors_count,
       upserted.occupancy_rate,
       upserted.revenue_cents
     FROM upserted
     JOIN recorded USING (org_id)`,
    [input.organizationId, input.date],
  );

  const row = rows[0];
  if (!row) throw new Error('Analytics rollup did not produce a row');

  return {
    organizationId: row.org_id,
    date: row.date,
    bookingsCount: row.bookings_count,
    visitorsCount: row.visitors_count,
    occupancyRate: Number(row.occupancy_rate),
    revenueCents: row.revenue_cents,
  };
}
