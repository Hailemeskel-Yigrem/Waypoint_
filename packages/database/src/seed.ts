import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPool } from './client.js';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL required');
  const pool = createPool(url);
  const sql = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '../sql/seed.sql'),
    'utf8',
  );
  await pool.query(sql);
  await pool.end();
  console.log('Seed complete');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
