#!/usr/bin/env node
/** Part 2: logging, config, auth packages */
import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const counts = {};

function write(relPath, content) {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf8');
  const top = relPath.split(/[/\\]/)[0];
  counts[top] = (counts[top] || 0) + 1;
}

function pkgJson(name, extra = {}) {
  return JSON.stringify({ name, version: '0.1.0', private: true, type: 'module', main: './dist/index.js', types: './dist/index.d.ts', exports: { '.': { types: './dist/index.d.ts', import: './dist/index.js' } }, scripts: { build: 'tsc -p tsconfig.json', test: 'vitest run', lint: 'eslint src', typecheck: 'tsc --noEmit', clean: 'rimraf dist' }, ...extra }, null, 2);
}

function tsconfig(jsx) {
  return JSON.stringify({ extends: '../../tsconfig.base.json', compilerOptions: { outDir: './dist', rootDir: './src', ...(jsx ? { jsx: 'react-jsx' } : {}) }, include: ['src/**/*'] }, null, 2);
}

// ============ LOGGING ============
write('packages/logging/package.json', pkgJson('@waypoint/logging', {
  dependencies: { '@waypoint/shared': 'workspace:*' },
  devDependencies: { vitest: '^2.1.8', typescript: '^5.7.3', rimraf: '^6.0.1' },
}));
write('packages/logging/tsconfig.json', tsconfig());
write('packages/logging/vitest.config.ts', `import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { globals: true, environment: 'node' } });
`);

write('packages/logging/src/levels.ts', `export const LogLevels = { debug: 10, info: 20, warn: 30, error: 40, fatal: 50 } as const;
export type LogLevelName = keyof typeof LogLevels;
export type LogLevelValue = (typeof LogLevels)[LogLevelName];

export function parseLogLevel(input: string): LogLevelName {
  const normalized = input.toLowerCase();
  if (normalized in LogLevels) return normalized as LogLevelName;
  return 'info';
}

export function shouldLog(current: LogLevelValue, message: LogLevelValue): boolean {
  return message >= current;
}
`);

write('packages/logging/src/correlation.ts', `import { AsyncLocalStorage } from 'node:async_hooks';

export interface CorrelationContext {
  correlationId: string;
  requestId?: string;
  orgId?: string;
  userId?: string;
}

const storage = new AsyncLocalStorage<CorrelationContext>();

export function runWithCorrelation<T>(ctx: CorrelationContext, fn: () => T): T {
  return storage.run(ctx, fn);
}

export function getCorrelationContext(): CorrelationContext | undefined {
  return storage.getStore();
}

export function getCorrelationId(): string | undefined {
  return storage.getStore()?.correlationId;
}

export function createCorrelationId(): string {
  return crypto.randomUUID();
}
`);

write('packages/logging/src/serializer.ts', `import type { LogLevelName } from './levels.js';
import { getCorrelationContext } from './correlation.js';

export interface LogEntry {
  level: LogLevelName;
  message: string;
  timestamp: string;
  service?: string;
  correlationId?: string;
  requestId?: string;
  orgId?: string;
  userId?: string;
  meta?: Record<string, unknown>;
  error?: { name: string; message: string; stack?: string };
}

export function serializeLogEntry(
  level: LogLevelName,
  message: string,
  meta?: Record<string, unknown>,
  service?: string,
  error?: Error,
): string {
  const ctx = getCorrelationContext();
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    service,
    correlationId: ctx?.correlationId,
    requestId: ctx?.requestId,
    orgId: ctx?.orgId,
    userId: ctx?.userId,
    meta,
  };
  if (error) {
    entry.error = { name: error.name, message: error.message, stack: error.stack };
  }
  return JSON.stringify(entry);
}
`);

write('packages/logging/src/logger.ts', `import { LogLevels, parseLogLevel, shouldLog, type LogLevelName } from './levels.js';
import { serializeLogEntry } from './serializer.js';

export interface LoggerOptions {
  service?: string;
  level?: LogLevelName;
  bindings?: Record<string, unknown>;
}

export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>, error?: Error): void;
  fatal(message: string, meta?: Record<string, unknown>, error?: Error): void;
  child(bindings: Record<string, unknown>): Logger;
}

type Writer = (line: string) => void;

export function createLogger(options: LoggerOptions = {}, writer: Writer = (line) => console.log(line)): Logger {
  const levelName = options.level ?? parseLogLevel(process.env.LOG_LEVEL ?? 'info');
  const minLevel = LogLevels[levelName];
  const service = options.service;
  const bindings = options.bindings ?? {};

  const log = (level: LogLevelName, message: string, meta?: Record<string, unknown>, error?: Error) => {
    if (!shouldLog(minLevel, LogLevels[level])) return;
    const merged = { ...bindings, ...meta };
    writer(serializeLogEntry(level, message, Object.keys(merged).length ? merged : undefined, service, error));
  };

  return {
    debug: (m, meta) => log('debug', m, meta),
    info: (m, meta) => log('info', m, meta),
    warn: (m, meta) => log('warn', m, meta),
    error: (m, meta, err) => log('error', m, meta, err),
    fatal: (m, meta, err) => log('fatal', m, meta, err),
    child: (childBindings) =>
      createLogger({ service, level: levelName, bindings: { ...bindings, ...childBindings } }, writer),
  };
}
`);

write('packages/logging/src/index.ts', `export * from './levels.js';
export * from './correlation.js';
export * from './serializer.js';
export * from './logger.js';
`);

const loggingTests = ['levels', 'correlation', 'serializer', 'logger'];
for (const t of loggingTests) {
  write(`packages/logging/src/${t}.test.ts`, `import { describe, it, expect, vi } from 'vitest';
import * as mod from './${t}.js';

describe('${t}', () => {
  it('module exports', () => {
    expect(mod).toBeDefined();
  });
});
`);
}
write('packages/logging/src/logger.integration.test.ts', `import { describe, it, expect, vi } from 'vitest';
import { createLogger } from './logger.js';
import { runWithCorrelation } from './correlation.js';

describe('logger integration', () => {
  it('writes JSON with correlation', () => {
    const lines: string[] = [];
    const logger = createLogger({ service: 'test' }, (l) => lines.push(l));
    runWithCorrelation({ correlationId: 'abc' }, () => {
      logger.info('hello', { foo: 1 });
    });
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0]!);
    expect(parsed.message).toBe('hello');
    expect(parsed.correlationId).toBe('abc');
  });
  it('child logger merges bindings', () => {
    const lines: string[] = [];
    const logger = createLogger({}, (l) => lines.push(l));
    logger.child({ orgId: 'o1' }).info('evt');
    const parsed = JSON.parse(lines[0]!);
    expect(parsed.meta.orgId).toBe('o1');
  });
});
`);

// ============ CONFIG ============
write('packages/config/package.json', pkgJson('@waypoint/config', {
  dependencies: { zod: '^3.24.1', '@waypoint/shared': 'workspace:*' },
  devDependencies: { vitest: '^2.1.8', typescript: '^5.7.3', rimraf: '^6.0.1' },
}));
write('packages/config/tsconfig.json', tsconfig());
write('packages/config/vitest.config.ts', `import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { globals: true, environment: 'node' } });
`);

write('packages/config/src/load-env.ts', `import { z } from 'zod';

export function loadEnv<T extends z.ZodTypeAny>(
  schema: T,
  source: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): z.infer<T> {
  const parsed = schema.safeParse(source);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => \`\${i.path.join('.')}: \${i.message}\`).join('; ');
    throw new Error(\`Invalid environment: \${messages}\`);
  }
  return parsed.data;
}

export function loadEnvSafe<T extends z.ZodTypeAny>(
  schema: T,
  source: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
) {
  return schema.safeParse(source);
}
`);

write('packages/config/src/base.ts', `import { z } from 'zod';

export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  DATABASE_URL: z.string().url().optional(),
  REDIS_URL: z.string().url().optional(),
});

export type BaseEnv = z.infer<typeof baseEnvSchema>;
`);

write('packages/config/src/api.ts', `import { z } from 'zod';
import { baseEnvSchema } from './base.js';

export const apiEnvSchema = baseEnvSchema.extend({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  HOST: z.string().default('0.0.0.0'),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('*'),
  RATE_LIMIT_MAX: z.coerce.number().int().default(100),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;

export const apiDefaults: Partial<ApiEnv> = {
  PORT: 3000,
  HOST: '0.0.0.0',
  JWT_EXPIRES_IN: '7d',
  CORS_ORIGIN: '*',
  RATE_LIMIT_MAX: 100,
};
`);

write('packages/config/src/web.ts', `import { z } from 'zod';
import { baseEnvSchema } from './base.js';

export const webEnvSchema = baseEnvSchema.extend({
  VITE_API_URL: z.string().url().default('http://localhost:3000'),
  VITE_APP_NAME: z.string().default('Waypoint Admin'),
  VITE_PORT: z.coerce.number().int().default(5173),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

export const webDefaults: Partial<WebEnv> = {
  VITE_API_URL: 'http://localhost:3000',
  VITE_APP_NAME: 'Waypoint Admin',
  VITE_PORT: 5173,
};
`);

write('packages/config/src/worker.ts', `import { z } from 'zod';
import { baseEnvSchema } from './base.js';

export const workerEnvSchema = baseEnvSchema.extend({
  WORKER_CONCURRENCY: z.coerce.number().int().min(1).max(100).default(5),
  WORKER_QUEUE_ADAPTER: z.enum(['memory', 'redis']).default('memory'),
  WORKER_POLL_INTERVAL_MS: z.coerce.number().int().min(100).default(1000),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().optional(),
  SMTP_FROM: z.string().email().optional(),
});

export type WorkerEnv = z.infer<typeof workerEnvSchema>;

export const workerDefaults: Partial<WorkerEnv> = {
  WORKER_CONCURRENCY: 5,
  WORKER_QUEUE_ADAPTER: 'memory',
  WORKER_POLL_INTERVAL_MS: 1000,
};
`);

write('packages/config/src/index.ts', `export * from './load-env.js';
export * from './base.js';
export * from './api.js';
export * from './web.js';
export * from './worker.js';
`);

['load-env', 'base', 'api', 'web', 'worker'].forEach((f) => {
  write(`packages/config/src/${f}.test.ts`, `import { describe, it, expect } from 'vitest';
import * as mod from './${f}.js';

describe('${f}', () => {
  it('exports', () => expect(mod).toBeDefined());
});
`);
});

write('packages/config/src/load-env.integration.test.ts', `import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { loadEnv } from './load-env.js';

describe('loadEnv integration', () => {
  it('parses valid env', () => {
    const schema = z.object({ FOO: z.string().default('bar') });
    expect(loadEnv(schema, {})).toEqual({ FOO: 'bar' });
  });
  it('throws on invalid', () => {
    const schema = z.object({ PORT: z.coerce.number() });
    expect(() => loadEnv(schema, { PORT: 'abc' })).toThrow('Invalid environment');
  });
});
`);

// ============ AUTH ============
write('packages/auth/package.json', pkgJson('@waypoint/auth', {
  dependencies: {
    '@waypoint/shared': 'workspace:*',
    'jsonwebtoken': '^9.0.2',
    'bcryptjs': '^2.4.3',
  },
  devDependencies: {
    vitest: '^2.1.8',
    typescript: '^5.7.3',
    rimraf: '^6.0.1',
    '@types/jsonwebtoken': '^9.0.7',
    '@types/bcryptjs': '^2.4.6',
  },
}));
write('packages/auth/tsconfig.json', tsconfig());
write('packages/auth/vitest.config.ts', `import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { globals: true, environment: 'node' } });
`);

write('packages/auth/src/session.ts', `import type { UserRole } from '@waypoint/shared';

export interface SessionUser {
  id: string;
  orgId: string;
  email: string;
  role: UserRole;
}

export interface Session {
  user: SessionUser;
  issuedAt: number;
  expiresAt: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export function isSessionExpired(session: Session, now = Date.now()): boolean {
  return now >= session.expiresAt;
}
`);

write('packages/auth/src/password.ts', `import bcrypt from 'bcryptjs';
import { ok, err, type Result } from '@waypoint/shared';

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function validatePasswordStrength(password: string): Result<string, string> {
  if (password.length < 8) return err('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) return err('Password must contain an uppercase letter');
  if (!/[a-z]/.test(password)) return err('Password must contain a lowercase letter');
  if (!/[0-9]/.test(password)) return err('Password must contain a number');
  return ok(password);
}
`);

write('packages/auth/src/jwt.ts', `import jwt from 'jsonwebtoken';
import type { SessionUser } from './session.js';

export interface JwtPayload {
  sub: string;
  orgId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface JwtOptions {
  secret: string;
  expiresIn?: string | number;
  issuer?: string;
}

export function issueToken(user: SessionUser, options: JwtOptions): string {
  const payload: JwtPayload = {
    sub: user.id,
    orgId: user.orgId,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, options.secret, {
    expiresIn: options.expiresIn ?? '7d',
    issuer: options.issuer ?? 'waypoint',
  });
}

export function verifyToken(token: string, secret: string): JwtPayload {
  const decoded = jwt.verify(token, secret, { issuer: 'waypoint' });
  if (typeof decoded === 'string') throw new Error('Invalid token payload');
  return decoded as JwtPayload;
}

export function decodeToken(token: string): JwtPayload | null {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded === 'string') return null;
  return decoded as JwtPayload;
}

export function payloadToSessionUser(payload: JwtPayload): SessionUser {
  return {
    id: payload.sub,
    orgId: payload.orgId,
    email: payload.email,
    role: payload.role as SessionUser['role'],
  };
}
`);

write('packages/auth/src/rbac.ts', `import type { UserRole } from '@waypoint/shared';

export type Permission =
  | 'org:read'
  | 'org:write'
  | 'users:read'
  | 'users:write'
  | 'spaces:read'
  | 'spaces:write'
  | 'bookings:read'
  | 'bookings:write'
  | 'visitors:read'
  | 'visitors:write'
  | 'billing:read'
  | 'billing:write'
  | 'analytics:read'
  | 'settings:write';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: [
    'org:read', 'org:write', 'users:read', 'users:write',
    'spaces:read', 'spaces:write', 'bookings:read', 'bookings:write',
    'visitors:read', 'visitors:write', 'billing:read', 'billing:write',
    'analytics:read', 'settings:write',
  ],
  admin: [
    'org:read', 'org:write', 'users:read', 'users:write',
    'spaces:read', 'spaces:write', 'bookings:read', 'bookings:write',
    'visitors:read', 'visitors:write', 'billing:read', 'analytics:read', 'settings:write',
  ],
  manager: [
    'org:read', 'users:read', 'spaces:read', 'spaces:write',
    'bookings:read', 'bookings:write', 'visitors:read', 'visitors:write', 'analytics:read',
  ],
  member: ['org:read', 'spaces:read', 'bookings:read', 'bookings:write', 'visitors:read', 'visitors:write'],
  guest: ['spaces:read', 'bookings:read'],
};

export function getPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return getPermissions(role).includes(permission);
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  const set = new Set(getPermissions(role));
  return permissions.some((p) => set.has(p));
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  const set = new Set(getPermissions(role));
  return permissions.every((p) => set.has(p));
}

export function requirePermission(role: UserRole, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(\`Forbidden: missing permission \${permission}\`);
  }
}
`);

write('packages/auth/src/index.ts', `export * from './session.js';
export * from './password.js';
export * from './jwt.js';
export * from './rbac.js';
`);

write('packages/auth/src/password.test.ts', `import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, validatePasswordStrength } from './password.js';

describe('password', () => {
  it('hashes and verifies', async () => {
    const hash = await hashPassword('Secret123');
    expect(await verifyPassword('Secret123', hash)).toBe(true);
    expect(await verifyPassword('wrong', hash)).toBe(false);
  });
  it('validates strength', () => {
    expect(validatePasswordStrength('short').ok).toBe(false);
    expect(validatePasswordStrength('ValidPass1').ok).toBe(true);
  });
});
`);

write('packages/auth/src/jwt.test.ts', `import { describe, it, expect } from 'vitest';
import { issueToken, verifyToken, payloadToSessionUser } from './jwt.js';

describe('jwt', () => {
  const secret = 'test-secret-key-with-enough-length!!';
  const user = { id: 'u1', orgId: 'o1', email: 'a@b.com', role: 'member' as const };

  it('issues and verifies', () => {
    const token = issueToken(user, { secret, expiresIn: '1h' });
    const payload = verifyToken(token, secret);
    expect(payload.sub).toBe('u1');
    expect(payloadToSessionUser(payload).email).toBe('a@b.com');
  });
});
`);

write('packages/auth/src/rbac.test.ts', `import { describe, it, expect } from 'vitest';
import { hasPermission, requirePermission, getPermissions } from './rbac.js';

describe('rbac', () => {
  it('owner has billing write', () => {
    expect(hasPermission('owner', 'billing:write')).toBe(true);
  });
  it('guest lacks users write', () => {
    expect(hasPermission('guest', 'users:write')).toBe(false);
  });
  it('requirePermission throws', () => {
    expect(() => requirePermission('guest', 'users:write')).toThrow('Forbidden');
  });
  it('getPermissions returns array', () => {
    expect(getPermissions('member').length).toBeGreaterThan(0);
  });
});
`);

write('packages/auth/src/session.test.ts', `import { describe, it, expect } from 'vitest';
import { isSessionExpired } from './session.js';

describe('session', () => {
  it('detects expiry', () => {
    const session = { user: { id: '1', orgId: 'o', email: 'e', role: 'member' as const }, issuedAt: 0, expiresAt: 100 };
    expect(isSessionExpired(session, 200)).toBe(true);
    expect(isSessionExpired(session, 50)).toBe(false);
  });
});
`);

console.log('Generated logging, config, auth packages');
