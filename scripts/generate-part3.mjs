#!/usr/bin/env node
/** Part 3: database + ui packages */
import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function write(relPath, content) {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf8');
}

function pkgJson(name, extra = {}) {
  return JSON.stringify({ name, version: '0.1.0', private: true, type: 'module', main: './dist/index.js', types: './dist/index.d.ts', exports: { '.': { types: './dist/index.d.ts', import: './dist/index.js' } }, scripts: { build: 'tsc -p tsconfig.json', test: 'vitest run', typecheck: 'tsc --noEmit', clean: 'rimraf dist', migrate: 'node dist/migrate.js', seed: 'node dist/seed.js', ...extra.scripts }, ...extra }, null, 2);
}

// ============ DATABASE ============
write('packages/database/package.json', pkgJson('@waypoint/database', {
  dependencies: { '@waypoint/shared': 'workspace:*', pg: '^8.13.1' },
  devDependencies: { vitest: '^2.1.8', typescript: '^5.7.3', rimraf: '^6.0.1', '@types/pg': '^8.11.10' },
}));
write('packages/database/tsconfig.json', JSON.stringify({ extends: '../../tsconfig.base.json', compilerOptions: { outDir: './dist', rootDir: './src' }, include: ['src/**/*'] }, null, 2));
write('packages/database/vitest.config.ts', `import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { globals: true, environment: 'node' } });
`);

write('packages/database/sql/schema.sql', `-- Waypoint PostgreSQL schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(64) NOT NULL UNIQUE,
  timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
  locale VARCHAR(16) NOT NULL DEFAULT 'en-US',
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  logo_url TEXT,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'member',
  avatar_url TEXT,
  department VARCHAR(100),
  title VARCHAR(100),
  phone VARCHAR(32),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, email)
);

CREATE TABLE spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(64) NOT NULL,
  type VARCHAR(32) NOT NULL,
  floor VARCHAR(50),
  capacity INT NOT NULL DEFAULT 1,
  amenities JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, slug)
);

CREATE TABLE desks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  label VARCHAR(50) NOT NULL,
  is_bookable BOOLEAN NOT NULL DEFAULT TRUE,
  coordinates JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_type VARCHAR(16) NOT NULL,
  resource_id UUID NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  host_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(200),
  expected_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'expected',
  checked_in_at TIMESTAMPTZ,
  checked_out_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(32) NOT NULL,
  capacity INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE amenity_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  number VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  subtotal_cents INT NOT NULL,
  tax_cents INT NOT NULL DEFAULT 0,
  total_cents INT NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  due_at TIMESTAMPTZ NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, number)
);

CREATE TABLE invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price_cents INT NOT NULL,
  total_cents INT NOT NULL
);

CREATE TABLE analytics_rollups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  bookings_count INT NOT NULL DEFAULT 0,
  visitors_count INT NOT NULL DEFAULT 0,
  occupancy_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  peak_hour INT,
  revenue_cents INT NOT NULL DEFAULT 0,
  UNIQUE(org_id, date)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel VARCHAR(16) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID NOT NULL REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
  event VARCHAR(64) NOT NULL,
  payload JSONB NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'pending',
  attempts INT NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_org ON users(org_id);
CREATE INDEX idx_bookings_org_dates ON bookings(org_id, start_at, end_at);
CREATE INDEX idx_visitors_org_status ON visitors(org_id, status);
CREATE INDEX idx_analytics_org_date ON analytics_rollups(org_id, date);
`);

const migrations = [
  ['001_create_organizations.sql', 'CREATE TABLE IF NOT EXISTS organizations (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(200) NOT NULL, slug VARCHAR(64) NOT NULL UNIQUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());'],
  ['002_create_users.sql', 'CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), email VARCHAR(255) NOT NULL, password_hash TEXT NOT NULL, first_name VARCHAR(100) NOT NULL, last_name VARCHAR(100) NOT NULL, role VARCHAR(32) NOT NULL DEFAULT \'member\', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(org_id, email));'],
  ['003_add_user_profile_fields.sql', 'ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT; ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(100); ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;'],
  ['004_create_spaces.sql', 'CREATE TABLE IF NOT EXISTS spaces (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), name VARCHAR(200) NOT NULL, slug VARCHAR(64) NOT NULL, type VARCHAR(32) NOT NULL, capacity INT NOT NULL DEFAULT 1, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(org_id, slug));'],
  ['005_create_desks.sql', 'CREATE TABLE IF NOT EXISTS desks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), space_id UUID NOT NULL REFERENCES spaces(id), label VARCHAR(50) NOT NULL, is_bookable BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());'],
  ['006_create_bookings.sql', 'CREATE TABLE IF NOT EXISTS bookings (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), user_id UUID NOT NULL REFERENCES users(id), resource_type VARCHAR(16) NOT NULL, resource_id UUID NOT NULL, start_at TIMESTAMPTZ NOT NULL, end_at TIMESTAMPTZ NOT NULL, status VARCHAR(32) NOT NULL DEFAULT \'confirmed\', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());'],
  ['007_create_visitors.sql', 'CREATE TABLE IF NOT EXISTS visitors (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), host_user_id UUID NOT NULL REFERENCES users(id), first_name VARCHAR(100) NOT NULL, last_name VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL, expected_at TIMESTAMPTZ NOT NULL, expires_at TIMESTAMPTZ NOT NULL, status VARCHAR(32) NOT NULL DEFAULT \'expected\', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());'],
  ['008_create_amenities.sql', 'CREATE TABLE IF NOT EXISTS amenities (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), name VARCHAR(200) NOT NULL, type VARCHAR(32) NOT NULL, capacity INT NOT NULL DEFAULT 1, is_active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()); CREATE TABLE IF NOT EXISTS amenity_bookings (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), amenity_id UUID NOT NULL REFERENCES amenities(id), user_id UUID NOT NULL REFERENCES users(id), start_at TIMESTAMPTZ NOT NULL, end_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());'],
  ['009_create_billing.sql', 'CREATE TABLE IF NOT EXISTS invoices (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), number VARCHAR(32) NOT NULL, status VARCHAR(32) NOT NULL DEFAULT \'draft\', period_start DATE NOT NULL, period_end DATE NOT NULL, subtotal_cents INT NOT NULL, tax_cents INT NOT NULL DEFAULT 0, total_cents INT NOT NULL, currency CHAR(3) NOT NULL DEFAULT \'USD\', due_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(org_id, number)); CREATE TABLE IF NOT EXISTS invoice_line_items (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), invoice_id UUID NOT NULL REFERENCES invoices(id), description TEXT NOT NULL, quantity INT NOT NULL DEFAULT 1, unit_price_cents INT NOT NULL, total_cents INT NOT NULL);'],
  ['010_create_analytics.sql', 'CREATE TABLE IF NOT EXISTS analytics_rollups (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), date DATE NOT NULL, bookings_count INT NOT NULL DEFAULT 0, visitors_count INT NOT NULL DEFAULT 0, occupancy_rate NUMERIC(5,2) NOT NULL DEFAULT 0, revenue_cents INT NOT NULL DEFAULT 0, UNIQUE(org_id, date));'],
  ['011_create_notifications_webhooks.sql', 'CREATE TABLE IF NOT EXISTS notifications (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), user_id UUID NOT NULL REFERENCES users(id), channel VARCHAR(16) NOT NULL, subject VARCHAR(255) NOT NULL, body TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()); CREATE TABLE IF NOT EXISTS webhook_endpoints (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), url TEXT NOT NULL, secret TEXT NOT NULL, events JSONB NOT NULL DEFAULT \'[]\', is_active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()); CREATE TABLE IF NOT EXISTS webhook_deliveries (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), endpoint_id UUID NOT NULL REFERENCES webhook_endpoints(id), event VARCHAR(64) NOT NULL, payload JSONB NOT NULL, status VARCHAR(16) NOT NULL DEFAULT \'pending\', attempts INT NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());'],
  ['012_add_indexes_and_org_settings.sql', 'ALTER TABLE organizations ADD COLUMN IF NOT EXISTS timezone VARCHAR(64) NOT NULL DEFAULT \'UTC\'; ALTER TABLE organizations ADD COLUMN IF NOT EXISTS settings JSONB NOT NULL DEFAULT \'{}\'; CREATE INDEX IF NOT EXISTS idx_bookings_org_dates ON bookings(org_id, start_at, end_at); CREATE INDEX IF NOT EXISTS idx_visitors_org_status ON visitors(org_id, status);'],
];

for (const [name, sql] of migrations) {
  write(`packages/database/sql/migrations/${name}`, `-- Migration: ${name}\n${sql}\n`);
}

write('packages/database/sql/seed.sql', `-- Waypoint seed data
INSERT INTO organizations (id, name, slug, timezone, settings) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Acme Corp', 'acme-corp', 'America/New_York', '{"allowGuestBookings": true, "visitorExpiryHours": 24, "bookingReminderMinutes": 60, "requireVisitorApproval": false}')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO users (id, org_id, email, password_hash, first_name, last_name, role) VALUES
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'admin@acme.example', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2oQKqGKKK.KK.', 'Admin', 'User', 'owner'),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'member@acme.example', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2oQKqGKKK.KK.', 'Jane', 'Member', 'member')
ON CONFLICT DO NOTHING;

INSERT INTO spaces (id, org_id, name, slug, type, capacity) VALUES
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Floor 3 Open Area', 'floor-3-open', 'open_area', 50),
  ('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Conference Room A', 'conf-a', 'meeting_room', 8)
ON CONFLICT DO NOTHING;
`);

write('packages/database/src/client.ts', `import pg from 'pg';

export type QueryResult<T> = { rows: T[]; rowCount: number };

export interface DatabaseClient {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;
  close(): Promise<void>;
}

export function createPool(connectionString: string): pg.Pool {
  return new pg.Pool({ connectionString, max: 20, idleTimeoutMillis: 30000 });
}

export function poolToClient(pool: pg.Pool): DatabaseClient {
  return {
    query: async (sql, params) => {
      const result = await pool.query(sql, params);
      return { rows: result.rows as Record<string, unknown>[], rowCount: result.rowCount ?? 0 };
    },
    close: () => pool.end(),
  };
}
`);

write('packages/database/src/repository.ts', `import type { DatabaseClient } from './client.js';

export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(
    protected readonly db: DatabaseClient,
    protected readonly table: string,
  ) {}

  async findById(id: string): Promise<T | null> {
    const { rows } = await this.db.query<T>(\`SELECT * FROM \${this.table} WHERE id = $1\`, [id]);
    return rows[0] ?? null;
  }

  async findByOrg(orgId: string, limit = 100, offset = 0): Promise<T[]> {
    const { rows } = await this.db.query<T>(
      \`SELECT * FROM \${this.table} WHERE org_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3\`,
      [orgId, limit, offset],
    );
    return rows as T[];
  }

  async countByOrg(orgId: string): Promise<number> {
    const { rows } = await this.db.query<{ count: string }>(
      \`SELECT COUNT(*)::text AS count FROM \${this.table} WHERE org_id = $1\`,
      [orgId],
    );
    return parseInt(rows[0]?.count ?? '0', 10);
  }

  async deleteById(id: string): Promise<boolean> {
    const { rowCount } = await this.db.query(\`DELETE FROM \${this.table} WHERE id = $1\`, [id]);
    return rowCount > 0;
  }
}
`);

write('packages/database/src/repositories/booking-repository.ts', `import { BaseRepository } from '../repository.js';
import type { DatabaseClient } from '../client.js';

export interface BookingRow {
  id: string;
  org_id: string;
  user_id: string;
  resource_type: string;
  resource_id: string;
  start_at: string;
  end_at: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export class BookingRepository extends BaseRepository<BookingRow> {
  constructor(db: DatabaseClient) {
    super(db, 'bookings');
  }

  async findUpcoming(orgId: string, withinMinutes: number): Promise<BookingRow[]> {
    const { rows } = await this.db.query<BookingRow>(
      \`SELECT * FROM bookings WHERE org_id = $1 AND status = 'confirmed'
       AND start_at BETWEEN NOW() AND NOW() + ($2 || ' minutes')::interval
       ORDER BY start_at ASC\`,
      [orgId, withinMinutes],
    );
    return rows;
  }
}
`);

write('packages/database/src/repositories/visitor-repository.ts', `import { BaseRepository } from '../repository.js';
import type { DatabaseClient } from '../client.js';

export interface VisitorRow {
  id: string;
  org_id: string;
  host_user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  expected_at: string;
  expires_at: string;
  status: string;
}

export class VisitorRepository extends BaseRepository<VisitorRow> {
  constructor(db: DatabaseClient) {
    super(db, 'visitors');
  }

  async findExpired(): Promise<VisitorRow[]> {
    const { rows } = await this.db.query<VisitorRow>(
      \`SELECT * FROM visitors WHERE status IN ('expected', 'checked_in') AND expires_at < NOW()\`,
    );
    return rows;
  }
}
`);

write('packages/database/src/repositories/index.ts', `export * from './booking-repository.js';
export * from './visitor-repository.js';
`);

write('packages/database/src/migrate.ts', `import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPool } from './client.js';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '../sql/migrations');

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL required');
  const pool = createPool(url);
  await pool.query(\`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  \`);
  const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  for (const file of files) {
    const applied = await pool.query('SELECT 1 FROM schema_migrations WHERE name = $1', [file]);
    if (applied.rowCount) continue;
    const sql = readFileSync(join(migrationsDir, file), 'utf8');
    await pool.query('BEGIN');
    try {
      await pool.query(sql);
      await pool.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
      await pool.query('COMMIT');
      console.log('Applied', file);
    } catch (e) {
      await pool.query('ROLLBACK');
      throw e;
    }
  }
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
`);

write('packages/database/src/seed.ts', `import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPool } from './client.js';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL required');
  const pool = createPool(url);
  const sql = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../sql/seed.sql'), 'utf8');
  await pool.query(sql);
  await pool.end();
  console.log('Seed complete');
}

main().catch((e) => { console.error(e); process.exit(1); });
`);

write('packages/database/src/index.ts', `export * from './client.js';
export * from './repository.js';
export * from './repositories/index.js';
`);

write('packages/database/src/repository.test.ts', `import { describe, it, expect, vi } from 'vitest';
import { BaseRepository } from './repository.js';

class TestRepo extends BaseRepository<{ id: string; org_id: string; created_at: string }> {
  constructor(db: any) { super(db, 'test_table'); }
}

describe('BaseRepository', () => {
  it('findById returns row', async () => {
    const db = { query: vi.fn().mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 }), close: vi.fn() };
    const repo = new TestRepo(db);
    expect(await repo.findById('1')).toEqual({ id: '1' });
  });
});
`);

// ============ UI ============
write('packages/ui/package.json', pkgJson('@waypoint/ui', {
  dependencies: { '@waypoint/shared': 'workspace:*', react: '^19.0.0', 'react-dom': '^19.0.0' },
  devDependencies: { typescript: '^5.7.3', rimraf: '^6.0.1', '@types/react': '^19.0.2', '@types/react-dom': '^19.0.2', vitest: '^2.1.8', '@testing-library/react': '^16.1.0', jsdom: '^25.0.1' },
  scripts: { build: 'tsc -p tsconfig.json', test: 'vitest run', typecheck: 'tsc --noEmit', clean: 'rimraf dist' },
}));
write('packages/ui/tsconfig.json', JSON.stringify({ extends: '../../tsconfig.base.json', compilerOptions: { outDir: './dist', rootDir: './src', jsx: 'react-jsx' }, include: ['src/**/*'] }, null, 2));
write('packages/ui/vitest.config.ts', `import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { globals: true, environment: 'jsdom' } });
`);

const uiComponents = {
  Button: {
    props: `export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}`,
    css: `.button { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 6px; font-weight: 500; cursor: pointer; border: 1px solid transparent; transition: background 0.15s, border-color 0.15s; }
.button:disabled { opacity: 0.6; cursor: not-allowed; }
.primary { background: #2563eb; color: #fff; }
.primary:hover:not(:disabled) { background: #1d4ed8; }
.secondary { background: #f1f5f9; color: #0f172a; border-color: #cbd5e1; }
.ghost { background: transparent; color: #334155; }
.danger { background: #dc2626; color: #fff; }
.sm { padding: 0.375rem 0.75rem; font-size: 0.875rem; }
.md { padding: 0.5rem 1rem; font-size: 0.9375rem; }
.lg { padding: 0.625rem 1.25rem; font-size: 1rem; }
.spinner { width: 1em; height: 1em; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }`,
    body: `import React from 'react';
import styles from './Button.module.css';
import { cn } from '../../utils/cn.js';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', loading, children, className, disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(styles.button, styles[variant], styles[size], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden />}
      {children}
    </button>
  );
}
`,
  },
  Input: {
    css: `.wrapper { display: flex; flex-direction: column; gap: 0.25rem; }
.label { font-size: 0.875rem; font-weight: 500; color: #334155; }
.input { padding: 0.5rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9375rem; }
.input:focus { outline: 2px solid #2563eb; border-color: #2563eb; }
.error { border-color: #dc2626; }
.hint { font-size: 0.8125rem; color: #64748b; }
.errorText { font-size: 0.8125rem; color: #dc2626; }`,
    body: `import React from 'react';
import styles from './Input.module.css';
import { cn } from '../../utils/cn.js';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, className, id, ...rest }: InputProps) {
  const inputId = id ?? rest.name;
  return (
    <div className={styles.wrapper}>
      {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
      <input id={inputId} className={cn(styles.input, error && styles.error, className)} aria-invalid={!!error} {...rest} />
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.errorText} role="alert">{error}</span>}
    </div>
  );
}
`,
  },
  Select: {
    css: `.wrapper { display: flex; flex-direction: column; gap: 0.25rem; }
.label { font-size: 0.875rem; font-weight: 500; }
.select { padding: 0.5rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; }`,
    body: `import React from 'react';
import styles from './Select.module.css';

export interface SelectOption { value: string; label: string; }
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
}

export function Select({ label, options, id, ...rest }: SelectProps) {
  return (
    <div className={styles.wrapper}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <select id={id} className={styles.select} {...rest}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
`,
  },
  Modal: {
    css: `.overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.dialog { background: #fff; border-radius: 8px; max-width: 32rem; width: 90%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
.header { padding: 1rem 1.25rem; border-bottom: 1px solid #e2e8f0; font-weight: 600; }
.body { padding: 1.25rem; }
.footer { padding: 1rem 1.25rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 0.5rem; }`,
    body: `import React, { useEffect } from 'react';
import styles from './Modal.module.css';

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>{title}</div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
`,
  },
  Table: {
    css: `.table { width: 100%; border-collapse: collapse; font-size: 0.9375rem; }
.th, .td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
.th { font-weight: 600; color: #475569; background: #f8fafc; }
.tr:hover .td { background: #f8fafc; }`,
    body: `import React from 'react';
import styles from './Table.module.css';

export interface Column<T> { key: string; header: string; render?: (row: T) => React.ReactNode; }
export interface TableProps<T> { columns: Column<T>[]; data: T[]; keyField?: keyof T; emptyMessage?: string; }

export function Table<T extends Record<string, unknown>>({ columns, data, keyField = 'id' as keyof T, emptyMessage = 'No data' }: TableProps<T>) {
  if (data.length === 0) return <p>{emptyMessage}</p>;
  return (
    <table className={styles.table}>
      <thead><tr>{columns.map((c) => <th key={c.key} className={styles.th}>{c.header}</th>)}</tr></thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={String(row[keyField] ?? i)} className={styles.tr}>
            {columns.map((c) => <td key={c.key} className={styles.td}>{c.render ? c.render(row) : String(row[c.key] ?? '')}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
  },
  Badge: {
    css: `.badge { display: inline-flex; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
.default { background: #e2e8f0; color: #334155; }
.success { background: #dcfce7; color: #166534; }
.warning { background: #fef3c7; color: #92400e; }
.error { background: #fee2e2; color: #991b1b; }
.info { background: #dbeafe; color: #1e40af; }`,
    body: `import React from 'react';
import styles from './Badge.module.css';
import { cn } from '../../utils/cn.js';

export interface BadgeProps { variant?: 'default' | 'success' | 'warning' | 'error' | 'info'; children: React.ReactNode; className?: string; }
export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return <span className={cn(styles.badge, styles[variant], className)}>{children}</span>;
}
`,
  },
  Avatar: {
    css: `.avatar { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; background: #e2e8f0; color: #475569; font-weight: 600; overflow: hidden; }
.sm { width: 2rem; height: 2rem; font-size: 0.75rem; }
.md { width: 2.5rem; height: 2.5rem; font-size: 0.875rem; }
.lg { width: 3.5rem; height: 3.5rem; font-size: 1.125rem; }
.img { width: 100%; height: 100%; object-fit: cover; }`,
    body: `import React from 'react';
import styles from './Avatar.module.css';
import { cn } from '../../utils/cn.js';

export interface AvatarProps { name: string; src?: string; size?: 'sm' | 'md' | 'lg'; className?: string; }
function initials(name: string) { return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase(); }
export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <span className={cn(styles.avatar, styles[size], className)} title={name}>
      {src ? <img src={src} alt={name} className={styles.img} /> : initials(name)}
    </span>
  );
}
`,
  },
  Tabs: {
    css: `.tabs { display: flex; flex-direction: column; gap: 1rem; }
.list { display: flex; gap: 0.25rem; border-bottom: 1px solid #e2e8f0; }
.tab { padding: 0.5rem 1rem; background: none; border: none; cursor: pointer; color: #64748b; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.active { color: #2563eb; border-bottom-color: #2563eb; font-weight: 500; }
.panel { padding: 0.5rem 0; }`,
    body: `import React, { useState } from 'react';
import styles from './Tabs.module.css';
import { cn } from '../../utils/cn.js';

export interface TabItem { id: string; label: string; content: React.ReactNode; }
export interface TabsProps { items: TabItem[]; defaultTab?: string; }

export function Tabs({ items, defaultTab }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? items[0]?.id ?? '');
  const current = items.find((t) => t.id === active);
  return (
    <div className={styles.tabs}>
      <div className={styles.list} role="tablist">
        {items.map((t) => (
          <button key={t.id} role="tab" aria-selected={active === t.id} className={cn(styles.tab, active === t.id && styles.active)} onClick={() => setActive(t.id)}>{t.label}</button>
        ))}
      </div>
      <div className={styles.panel} role="tabpanel">{current?.content}</div>
    </div>
  );
}
`,
  },
  Toast: {
    css: `.container { position: fixed; bottom: 1rem; right: 1rem; display: flex; flex-direction: column; gap: 0.5rem; z-index: 2000; }
.toast { padding: 0.75rem 1rem; border-radius: 6px; background: #1e293b; color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 16rem; }
.success { background: #166534; }
.error { background: #991b1b; }`,
    body: `import React, { createContext, useCallback, useContext, useState } from 'react';
import styles from './Toast.module.css';
import { cn } from '../../utils/cn.js';

export type ToastVariant = 'default' | 'success' | 'error';
export interface ToastMessage { id: string; message: string; variant?: ToastVariant; }
interface ToastContextValue { push: (message: string, variant?: ToastVariant) => void; }

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const push = useCallback((message: string, variant: ToastVariant = 'default') => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { id, message, variant }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className={styles.container}>
        {toasts.map((t) => <div key={t.id} className={cn(styles.toast, t.variant && styles[t.variant])}>{t.message}</div>)}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
`,
  },
  FormField: {
    css: `.field { display: flex; flex-direction: column; gap: 0.375rem; margin-bottom: 1rem; }
.label { font-size: 0.875rem; font-weight: 500; }
.required::after { content: ' *'; color: #dc2626; }
.error { font-size: 0.8125rem; color: #dc2626; }`,
    body: `import React from 'react';
import styles from './FormField.module.css';
import { cn } from '../../utils/cn.js';

export interface FormFieldProps { label: string; required?: boolean; error?: string; children: React.ReactNode; htmlFor?: string; }
export function FormField({ label, required, error, children, htmlFor }: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={cn(styles.label, required && styles.required)}>{label}</label>
      {children}
      {error && <span className={styles.error} role="alert">{error}</span>}
    </div>
  );
}
`,
  },
  EmptyState: {
    css: `.empty { text-align: center; padding: 3rem 1.5rem; color: #64748b; }
.title { font-size: 1.125rem; font-weight: 600; color: #334155; margin-bottom: 0.5rem; }
.action { margin-top: 1rem; }`,
    body: `import React from 'react';
import styles from './EmptyState.module.css';

export interface EmptyStateProps { title: string; description?: string; action?: React.ReactNode; }
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <div className={styles.title}>{title}</div>
      {description && <p>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
`,
  },
  PageHeader: {
    css: `.header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; }
.title { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin: 0; }
.subtitle { font-size: 0.9375rem; color: #64748b; margin-top: 0.25rem; }
.actions { display: flex; gap: 0.5rem; flex-shrink: 0; }`,
    body: `import React from 'react';
import styles from './PageHeader.module.css';

export interface PageHeaderProps { title: string; subtitle?: string; actions?: React.ReactNode; }
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
`,
  },
  Spinner: {
    css: `.spinner { border: 3px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.7s linear infinite; }
.sm { width: 1rem; height: 1rem; }
.md { width: 2rem; height: 2rem; }
.lg { width: 3rem; height: 3rem; }
@keyframes spin { to { transform: rotate(360deg); } }`,
    body: `import React from 'react';
import styles from './Spinner.module.css';
import { cn } from '../../utils/cn.js';

export interface SpinnerProps { size?: 'sm' | 'md' | 'lg'; className?: string; label?: string; }
export function Spinner({ size = 'md', className, label = 'Loading' }: SpinnerProps) {
  return <div className={cn(styles.spinner, styles[size], className)} role="status" aria-label={label} />;
}
`,
  },
  Card: {
    css: `.card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
.header { padding: 1rem 1.25rem; border-bottom: 1px solid #e2e8f0; font-weight: 600; }
.body { padding: 1.25rem; }
.footer { padding: 1rem 1.25rem; border-top: 1px solid #e2e8f0; background: #f8fafc; }`,
    body: `import React from 'react';
import styles from './Card.module.css';

export interface CardProps { title?: string; children: React.ReactNode; footer?: React.ReactNode; className?: string; }
export function Card({ title, children, footer, className }: CardProps) {
  return (
    <div className={[styles.card, className].filter(Boolean).join(' ')}>
      {title && <div className={styles.header}>{title}</div>}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
`,
  },
};

write('packages/ui/src/utils/cn.ts', `export function cn(...parts: (string | false | undefined | null)[]): string {
  return parts.filter(Boolean).join(' ');
}
`);

write('packages/ui/src/styles/tokens.css', `:root {
  --wp-color-primary: #2563eb;
  --wp-color-text: #0f172a;
  --wp-color-muted: #64748b;
  --wp-color-border: #e2e8f0;
  --wp-radius: 6px;
  --wp-font: system-ui, -apple-system, sans-serif;
}
`);

const layoutComponents = {
  Stack: `.stack { display: flex; flex-direction: column; }
.gap-sm { gap: 0.5rem; } .gap-md { gap: 1rem; } .gap-lg { gap: 1.5rem; }`,
  Row: `.row { display: flex; flex-direction: row; align-items: center; }
.gap-sm { gap: 0.5rem; } .gap-md { gap: 1rem; } .gap-lg { gap: 1.5rem; }`,
  Container: `.container { max-width: 72rem; margin: 0 auto; padding: 0 1.5rem; }`,
  Grid: `.grid { display: grid; gap: 1rem; }
.cols-2 { grid-template-columns: repeat(2, 1fr); }
.cols-3 { grid-template-columns: repeat(3, 1fr); }
.cols-4 { grid-template-columns: repeat(4, 1fr); }`,
};

for (const [name, css] of Object.entries(layoutComponents)) {
  write(`packages/ui/src/layout/${name}.module.css`, css);
  const isGrid = name === 'Grid';
  write(`packages/ui/src/layout/${name}.tsx`, `import React from 'react';
import styles from './${name}.module.css';
import { cn } from '../utils/cn.js';

export interface ${name}Props { children: React.ReactNode; gap?: 'sm' | 'md' | 'lg'; className?: string;${isGrid ? " cols?: 2 | 3 | 4;" : ''} }

export function ${name}({ children, gap = 'md', className${isGrid ? ', cols = 2' : ''} }: ${name}Props) {
  return <div className={cn(styles.${name.toLowerCase()}, styles[\`gap-\${gap}\`]${isGrid ? ', styles[\`cols-\${cols}\`]' : ''}, className)}>{children}</div>;
}
`);
}

for (const [name, def] of Object.entries(uiComponents)) {
  write(`packages/ui/src/components/${name}/${name}.module.css`, def.css);
  write(`packages/ui/src/components/${name}/${name}.tsx`, def.body);
  write(`packages/ui/src/components/${name}/index.ts`, `export * from './${name}.js';\n`);
}

write('packages/ui/src/components/index.ts', Object.keys(uiComponents).map(n => `export * from './${n}/index.js';`).join('\n') + '\n');
write('packages/ui/src/layout/index.ts', Object.keys(layoutComponents).map(n => `export * from './${n}.js';`).join('\n') + '\n');
write('packages/ui/src/index.ts', `export * from './components/index.js';
export * from './layout/index.js';
export * from './utils/cn.js';
`);

write('packages/ui/src/components/Button/Button.test.tsx', `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button.js';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button', { name: 'Click' })).toBeTruthy();
  });
});
`);

console.log('Generated database and ui packages');
