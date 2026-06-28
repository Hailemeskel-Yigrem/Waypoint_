import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type pg from 'pg';
import { createPool } from './client.js';

export const defaultMigrationsDir = join(dirname(fileURLToPath(import.meta.url)), '../migrations');

export interface MigrationSummary {
  applied: string[];
  skipped: string[];
}

function checksum(contents: string): string {
  return createHash('sha256').update(contents).digest('hex');
}

export async function runMigrations(
  pool: pg.Pool,
  migrationsDir = defaultMigrationsDir,
): Promise<MigrationSummary> {
  const client = await pool.connect();
  const summary: MigrationSummary = { applied: [], skipped: [] };

  try {
    await client.query('SELECT pg_advisory_lock($1)', [834_711_902]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        checksum CHAR(64),
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await client.query('ALTER TABLE schema_migrations ADD COLUMN IF NOT EXISTS checksum CHAR(64)');

    const files = readdirSync(migrationsDir)
      .filter((file) => /^\d+.*\.sql$/.test(file))
      .sort();
    if (files.length === 0) {
      throw new Error(`No migration files found in ${migrationsDir}`);
    }

    for (const file of files) {
      const sql = readFileSync(join(migrationsDir, file), 'utf8');
      const digest = checksum(sql);
      const existing = await client.query<{ checksum: string | null }>(
        'SELECT checksum FROM schema_migrations WHERE name = $1',
        [file],
      );

      if (existing.rowCount) {
        const recordedChecksum = existing.rows[0]?.checksum?.trim();
        if (recordedChecksum && recordedChecksum !== digest) {
          throw new Error(`Applied migration ${file} has been modified`);
        }
        if (!recordedChecksum) {
          await client.query('UPDATE schema_migrations SET checksum = $2 WHERE name = $1', [
            file,
            digest,
          ]);
        }
        summary.skipped.push(file);
        continue;
      }

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name, checksum) VALUES ($1, $2)', [
          file,
          digest,
        ]);
        await client.query('COMMIT');
        summary.applied.push(file);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
  } finally {
    await client.query('SELECT pg_advisory_unlock($1)', [834_711_902]).catch(() => undefined);
    client.release();
  }

  return summary;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL required');
  const pool = createPool(url);
  try {
    const result = await runMigrations(pool);
    for (const file of result.applied) console.log('Applied', file);
    console.log(
      `Migrations complete (${result.applied.length} applied, ${result.skipped.length} current)`,
    );
  } finally {
    await pool.end();
  }
}

const entrypoint = process.argv[1] ? resolve(process.argv[1]) : '';
if (entrypoint === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
