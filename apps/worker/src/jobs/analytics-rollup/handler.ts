import type { Job } from '../../queue/types.js';
import type { AnalyticsRollupJobData } from './types.js';
import type { Logger } from '@waypoint/logging';
import {
  createPool,
  poolToClient,
  refreshAnalyticsRollup,
  type AnalyticsRollupResult,
} from '@waypoint/database';

export type AnalyticsRollupRunner = (
  data: AnalyticsRollupJobData,
) => Promise<AnalyticsRollupResult>;

export async function runAnalyticsRollupWithPostgres(
  data: AnalyticsRollupJobData,
): Promise<AnalyticsRollupResult> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is required for analytics rollups');

  const pool = createPool(connectionString);
  try {
    return await refreshAnalyticsRollup(poolToClient(pool), {
      organizationId: data.orgId,
      date: data.date,
    });
  } finally {
    await pool.end();
  }
}

export async function handleAnalyticsRollup(
  job: Job<AnalyticsRollupJobData>,
  logger: Logger,
  run: AnalyticsRollupRunner = runAnalyticsRollupWithPostgres,
): Promise<void> {
  const { orgId, date } = job.data;
  if (!orgId) throw new Error('orgId is required');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('date must use YYYY-MM-DD');

  logger.info('Rolling up analytics', { orgId, date });
  const result = await run({ orgId, date });
  logger.info('Analytics rollup complete', {
    orgId,
    date,
    bookingsCount: result.bookingsCount,
    visitorsCount: result.visitorsCount,
    occupancyRate: result.occupancyRate,
    revenueCents: result.revenueCents,
  });
}
