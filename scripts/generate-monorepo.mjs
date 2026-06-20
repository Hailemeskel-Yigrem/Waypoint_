#!/usr/bin/env node
import { mkdirSync, writeFileSync, existsSync } from 'fs';
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
  return JSON.stringify(
    {
      name,
      version: '0.1.0',
      private: true,
      type: 'module',
      main: './dist/index.js',
      types: './dist/index.d.ts',
      exports: { '.': { types: './dist/index.d.ts', import: './dist/index.js' } },
      scripts: {
        build: 'tsc -p tsconfig.json',
        dev: 'tsc -p tsconfig.json --watch',
        test: 'vitest run',
        'test:watch': 'vitest',
        lint: 'eslint src --ext .ts,.tsx',
        typecheck: 'tsc -p tsconfig.json --noEmit',
        clean: 'rimraf dist',
        ...extra.scripts,
      },
      ...extra,
    },
    null,
    2,
  );
}

function tsconfig(references = [], jsx) {
  const compilerOptions = {
    extends: '../../tsconfig.base.json',
    compilerOptions: {
      outDir: './dist',
      rootDir: './src',
      ...(jsx ? { jsx: 'react-jsx' } : {}),
    },
    include: ['src/**/*'],
    ...(references.length ? { references } : {}),
  };
  return JSON.stringify(compilerOptions, null, 2);
}

function vitestConfig() {
  return `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
  },
});
`;
}

// ============ SHARED ============
write('packages/shared/package.json', pkgJson('@waypoint/shared', {
  dependencies: { zod: '^3.24.1' },
  devDependencies: { vitest: '^2.1.8', typescript: '^5.7.3', rimraf: '^6.0.1' },
}));
write('packages/shared/tsconfig.json', tsconfig());
write('packages/shared/vitest.config.ts', vitestConfig());

write('packages/shared/src/result.ts', `export type Ok<T> = { ok: true; value: T };
export type Err<E> = { ok: false; error: E };
export type Result<T, E = Error> = Ok<T> | Err<E>;

export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

export function err<E>(error: E): Err<E> {
  return { ok: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.ok;
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return !result.ok;
}

export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) return result.value;
  throw result.error instanceof Error ? result.error : new Error(String(result.error));
}

export function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> {
  return result.ok ? ok(fn(result.value)) : result;
}

export function flatMapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> {
  return result.ok ? fn(result.value) : result;
}
`);

write('packages/shared/src/events.ts', `export const WaypointEvents = {
  USER_CREATED: 'waypoint.user.created',
  USER_UPDATED: 'waypoint.user.updated',
  USER_DELETED: 'waypoint.user.deleted',
  ORG_CREATED: 'waypoint.org.created',
  ORG_UPDATED: 'waypoint.org.updated',
  BOOKING_CREATED: 'waypoint.booking.created',
  BOOKING_CANCELLED: 'waypoint.booking.cancelled',
  BOOKING_REMINDER: 'waypoint.booking.reminder',
  VISITOR_REGISTERED: 'waypoint.visitor.registered',
  VISITOR_EXPIRED: 'waypoint.visitor.expired',
  VISITOR_CHECKED_IN: 'waypoint.visitor.checked_in',
  NOTIFICATION_DISPATCHED: 'waypoint.notification.dispatched',
  WEBHOOK_DELIVERED: 'waypoint.webhook.delivered',
  WEBHOOK_FAILED: 'waypoint.webhook.failed',
  INVOICE_GENERATED: 'waypoint.invoice.generated',
  ANALYTICS_ROLLUP: 'waypoint.analytics.rollup',
  SPACE_CREATED: 'waypoint.space.created',
  DESK_CREATED: 'waypoint.desk.created',
  AMENITY_BOOKED: 'waypoint.amenity.booked',
} as const;

export type WaypointEventName = (typeof WaypointEvents)[keyof typeof WaypointEvents];

export interface EventPayload<T = Record<string, unknown>> {
  event: WaypointEventName;
  orgId: string;
  timestamp: string;
  data: T;
  correlationId?: string;
}

export function createEventPayload<T>(
  event: WaypointEventName,
  orgId: string,
  data: T,
  correlationId?: string,
): EventPayload<T> {
  return {
    event,
    orgId,
    timestamp: new Date().toISOString(),
    data,
    correlationId,
  };
}
`);

write('packages/shared/src/constants/index.ts', `export const APP_NAME = 'Waypoint';

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

export const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const VISITOR_STATUSES = ['expected', 'checked_in', 'checked_out', 'expired'] as const;
export type VisitorStatus = (typeof VISITOR_STATUSES)[number];

export const SPACE_TYPES = ['desk', 'meeting_room', 'phone_booth', 'open_area'] as const;
export type SpaceType = (typeof SPACE_TYPES)[number];

export const USER_ROLES = ['owner', 'admin', 'manager', 'member', 'guest'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const INVOICE_STATUSES = ['draft', 'sent', 'paid', 'overdue', 'void'] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const AMENITY_TYPES = ['parking', 'locker', 'gym', 'cafe', 'shower', 'bike_storage'] as const;
export type AmenityType = (typeof AMENITY_TYPES)[number];

export const WEBHOOK_EVENTS = [
  'booking.created',
  'booking.cancelled',
  'visitor.registered',
  'visitor.checked_in',
  'invoice.generated',
] as const;

export const TIMEZONE_DEFAULT = 'UTC';
export const CURRENCY_DEFAULT = 'USD';
export const LOCALE_DEFAULT = 'en-US';
`);

write('packages/shared/src/utils/slug.ts', `const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && slug.length >= 2 && slug.length <= 64;
}

export function uniqueSlug(base: string, existing: Set<string>): string {
  const root = slugify(base) || 'item';
  if (!existing.has(root)) return root;
  let i = 2;
  while (existing.has(\`\${root}-\${i}\`)) i++;
  return \`\${root}-\${i}\`;
}
`);

write('packages/shared/src/utils/date.ts', `const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 3_600_000;
const MS_PER_DAY = 86_400_000;

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * MS_PER_MINUTE);
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * MS_PER_HOUR);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatISODate(date: Date): string {
  return date.toISOString();
}

export function parseISODate(value: string): Date {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new Error(\`Invalid ISO date: \${value}\`);
  return d;
}

export function minutesBetween(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / MS_PER_MINUTE);
}

export function overlaps(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return \`\${minutes}m\`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? \`\${h}h\` : \`\${h}h \${m}m\`;
}
`);

write('packages/shared/src/utils/money.ts', `export interface Money {
  amountCents: number;
  currency: string;
}

export function money(amountCents: number, currency = 'USD'): Money {
  return { amountCents: Math.round(amountCents), currency };
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(\`Currency mismatch: \${a.currency} vs \${b.currency}\`);
  }
  return money(a.amountCents + b.amountCents, a.currency);
}

export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(\`Currency mismatch: \${a.currency} vs \${b.currency}\`);
  }
  return money(a.amountCents - b.amountCents, a.currency);
}

export function multiplyMoney(m: Money, factor: number): Money {
  return money(Math.round(m.amountCents * factor), m.currency);
}

export function formatMoney(m: Money, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: m.currency,
  }).format(m.amountCents / 100);
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function centsToDollars(cents: number): number {
  return cents / 100;
}

export function sumMoney(items: Money[]): Money {
  if (items.length === 0) return money(0);
  const currency = items[0]!.currency;
  const total = items.reduce((acc, item) => {
    if (item.currency !== currency) throw new Error('Currency mismatch in sum');
    return acc + item.amountCents;
  }, 0);
  return money(total, currency);
}
`);

// Types
const typeFiles = {
  'id.ts': `export type EntityId = string;
export type OrgId = string;
export type UserId = string;
export type BookingId = string;
export type SpaceId = string;
export type VisitorId = string;
`,
  'user.ts': `import type { UserRole } from '../constants/index.js';
import type { EntityId, OrgId } from './id.js';

export interface User {
  id: EntityId;
  orgId: OrgId;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  department?: string;
  title?: string;
  phone?: string;
}
`,
  'org.ts': `import type { EntityId } from './id.js';

export interface Organization {
  id: EntityId;
  name: string;
  slug: string;
  timezone: string;
  locale: string;
  currency: string;
  logoUrl?: string;
  settings: OrgSettings;
  createdAt: string;
  updatedAt: string;
}

export interface OrgSettings {
  allowGuestBookings: boolean;
  visitorExpiryHours: number;
  bookingReminderMinutes: number;
  requireVisitorApproval: boolean;
}
`,
  'space.ts': `import type { SpaceType } from '../constants/index.js';
import type { EntityId, OrgId } from './id.js';

export interface Space {
  id: EntityId;
  orgId: OrgId;
  name: string;
  slug: string;
  type: SpaceType;
  floor?: string;
  capacity: number;
  amenities: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Desk {
  id: EntityId;
  orgId: OrgId;
  spaceId: EntityId;
  label: string;
  isBookable: boolean;
  coordinates?: { x: number; y: number };
}
`,
  'booking.ts': `import type { BookingStatus } from '../constants/index.js';
import type { BookingId, EntityId, OrgId, UserId } from './id.js';

export interface Booking {
  id: BookingId;
  orgId: OrgId;
  userId: UserId;
  resourceType: 'desk' | 'space';
  resourceId: EntityId;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
`,
  'visitor.ts': `import type { VisitorStatus } from '../constants/index.js';
import type { EntityId, OrgId, UserId } from './id.js';

export interface Visitor {
  id: EntityId;
  orgId: OrgId;
  hostUserId: UserId;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  expectedAt: string;
  expiresAt: string;
  status: VisitorStatus;
  checkedInAt?: string;
  checkedOutAt?: string;
}
`,
  'amenity.ts': `import type { AmenityType } from '../constants/index.js';
import type { EntityId, OrgId } from './id.js';

export interface Amenity {
  id: EntityId;
  orgId: OrgId;
  name: string;
  type: AmenityType;
  capacity: number;
  isActive: boolean;
}

export interface AmenityBooking {
  id: EntityId;
  amenityId: EntityId;
  userId: EntityId;
  startAt: string;
  endAt: string;
}
`,
  'billing.ts': `import type { InvoiceStatus } from '../constants/index.js';
import type { EntityId, OrgId } from './id.js';
import type { Money } from '../utils/money.js';

export interface Invoice {
  id: EntityId;
  orgId: OrgId;
  number: string;
  status: InvoiceStatus;
  periodStart: string;
  periodEnd: string;
  subtotal: Money;
  tax: Money;
  total: Money;
  dueAt: string;
  paidAt?: string;
}

export interface InvoiceLineItem {
  id: EntityId;
  invoiceId: EntityId;
  description: string;
  quantity: number;
  unitPrice: Money;
  total: Money;
}
`,
  'analytics.ts': `import type { EntityId, OrgId } from './id.js';

export interface AnalyticsRollup {
  id: EntityId;
  orgId: OrgId;
  date: string;
  bookingsCount: number;
  visitorsCount: number;
  occupancyRate: number;
  peakHour: number;
  revenueCents: number;
}
`,
  'notification.ts': `import type { EntityId, OrgId, UserId } from './id.js';

export interface Notification {
  id: EntityId;
  orgId: OrgId;
  userId: UserId;
  channel: 'email' | 'push' | 'sms';
  subject: string;
  body: string;
  sentAt?: string;
  readAt?: string;
}
`,
  'webhook.ts': `import type { EntityId, OrgId } from './id.js';

export interface WebhookEndpoint {
  id: EntityId;
  orgId: OrgId;
  url: string;
  secret: string;
  events: string[];
  isActive: boolean;
}

export interface WebhookDelivery {
  id: EntityId;
  endpointId: EntityId;
  event: string;
  payload: Record<string, unknown>;
  status: 'pending' | 'delivered' | 'failed';
  attempts: number;
  lastAttemptAt?: string;
}
`,
  'pagination.ts': `export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 25,
): PaginatedResult<T> {
  const safePage = Math.max(1, page);
  const safeSize = Math.min(100, Math.max(1, pageSize));
  const start = (safePage - 1) * safeSize;
  const slice = items.slice(start, start + safeSize);
  const total = items.length;
  return {
    items: slice,
    total,
    page: safePage,
    pageSize: safeSize,
    totalPages: Math.ceil(total / safeSize) || 1,
  };
}
`,
  'api.ts': `export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiListResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
`,
};

for (const [file, content] of Object.entries(typeFiles)) {
  write(`packages/shared/src/types/${file}`, content);
}

write('packages/shared/src/types/index.ts', Object.keys(typeFiles).map(f => {
  const base = f.replace('.ts', '');
  return `export * from './${base}.js';`;
}).join('\n') + '\n');

// Schemas
write('packages/shared/src/schemas/common.ts', `import { z } from 'zod';
import { MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE } from '../constants/index.js';

export const entityIdSchema = z.string().uuid();
export const emailSchema = z.string().email().max(255);
export const slugSchema = z.string().min(2).max(64).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const isoDateSchema = z.string().datetime();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
`);

const schemaFiles = {
  'user.ts': `import { z } from 'zod';
import { USER_ROLES } from '../constants/index.js';
import { emailSchema, entityIdSchema } from './common.js';

export const createUserSchema = z.object({
  email: emailSchema,
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: z.enum(USER_ROLES).default('member'),
  password: z.string().min(8).max(128),
});

export const updateUserSchema = createUserSchema.partial().omit({ password: true });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
`,
  'org.ts': `import { z } from 'zod';
import { slugSchema } from './common.js';

export const orgSettingsSchema = z.object({
  allowGuestBookings: z.boolean().default(false),
  visitorExpiryHours: z.number().int().min(1).max(168).default(24),
  bookingReminderMinutes: z.number().int().min(5).max(1440).default(60),
  requireVisitorApproval: z.boolean().default(false),
});

export const createOrgSchema = z.object({
  name: z.string().min(2).max(200),
  slug: slugSchema,
  timezone: z.string().default('UTC'),
  locale: z.string().default('en-US'),
  currency: z.string().length(3).default('USD'),
  settings: orgSettingsSchema.optional(),
});

export const updateOrgSchema = createOrgSchema.partial();

export type CreateOrgInput = z.infer<typeof createOrgSchema>;
export type UpdateOrgInput = z.infer<typeof updateOrgSchema>;
`,
  'space.ts': `import { z } from 'zod';
import { SPACE_TYPES } from '../constants/index.js';
import { slugSchema } from './common.js';

export const createSpaceSchema = z.object({
  name: z.string().min(1).max(200),
  slug: slugSchema,
  type: z.enum(SPACE_TYPES),
  floor: z.string().max(50).optional(),
  capacity: z.number().int().min(1).max(10000).default(1),
  amenities: z.array(z.string()).default([]),
});

export const createDeskSchema = z.object({
  spaceId: z.string().uuid(),
  label: z.string().min(1).max(50),
  isBookable: z.boolean().default(true),
  coordinates: z.object({ x: z.number(), y: z.number() }).optional(),
});

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
export type CreateDeskInput = z.infer<typeof createDeskSchema>;
`,
  'booking.ts': `import { z } from 'zod';
import { isoDateSchema } from './common.js';

export const createBookingSchema = z
  .object({
    resourceType: z.enum(['desk', 'space']),
    resourceId: z.string().uuid(),
    startAt: isoDateSchema,
    endAt: isoDateSchema,
    notes: z.string().max(1000).optional(),
  })
  .refine((d) => new Date(d.endAt) > new Date(d.startAt), {
    message: 'endAt must be after startAt',
    path: ['endAt'],
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
`,
  'visitor.ts': `import { z } from 'zod';
import { emailSchema, isoDateSchema } from './common.js';

export const createVisitorSchema = z.object({
  hostUserId: z.string().uuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: emailSchema,
  company: z.string().max(200).optional(),
  expectedAt: isoDateSchema,
});

export type CreateVisitorInput = z.infer<typeof createVisitorSchema>;
`,
  'amenity.ts': `import { z } from 'zod';
import { AMENITY_TYPES } from '../constants/index.js';
import { isoDateSchema } from './common.js';

export const createAmenitySchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(AMENITY_TYPES),
  capacity: z.number().int().min(1).default(1),
});

export const bookAmenitySchema = z.object({
  amenityId: z.string().uuid(),
  startAt: isoDateSchema,
  endAt: isoDateSchema,
});

export type CreateAmenityInput = z.infer<typeof createAmenitySchema>;
export type BookAmenityInput = z.infer<typeof bookAmenitySchema>;
`,
};

for (const [file, content] of Object.entries(schemaFiles)) {
  write(`packages/shared/src/schemas/${file}`, content);
}

write('packages/shared/src/schemas/index.ts', Object.keys(schemaFiles).map(f => {
  return `export * from './${f.replace('.ts', '')}.js';`;
}).join('\n') + "\nexport * from './common.js';\n");

write('packages/shared/src/utils/index.ts', `export * from './date.js';
export * from './money.js';
export * from './slug.js';
`);

write('packages/shared/src/index.ts', `export * from './constants/index.js';
export * from './types/index.js';
export * from './schemas/index.js';
export * from './utils/index.js';
export * from './result.js';
export * from './events.js';
`);

// Shared tests
const sharedTests = {
  'result.test.ts': `import { describe, it, expect } from 'vitest';
import { ok, err, isOk, isErr, unwrap, mapResult, flatMapResult } from '../result.js';

describe('result', () => {
  it('ok creates success', () => {
    expect(ok(42)).toEqual({ ok: true, value: 42 });
  });
  it('err creates failure', () => {
    expect(err('fail')).toEqual({ ok: false, error: 'fail' });
  });
  it('unwrap returns value', () => {
    expect(unwrap(ok('x'))).toBe('x');
  });
  it('unwrap throws on err', () => {
    expect(() => unwrap(err(new Error('e')))).toThrow('e');
  });
  it('mapResult transforms ok', () => {
    expect(mapResult(ok(2), (n) => n * 2)).toEqual({ ok: true, value: 4 });
  });
  it('flatMapResult chains', () => {
    const r = flatMapResult(ok(2), (n) => (n > 0 ? ok(n + 1) : err('bad')));
    expect(r).toEqual({ ok: true, value: 3 });
  });
  it('isOk/isErr', () => {
    expect(isOk(ok(1))).toBe(true);
    expect(isErr(err(1))).toBe(true);
  });
});
`,
  'slug.test.ts': `import { describe, it, expect } from 'vitest';
import { slugify, isValidSlug, uniqueSlug } from '../utils/slug.js';

describe('slug', () => {
  it('slugifies text', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
  });
  it('validates slug', () => {
    expect(isValidSlug('hello-world')).toBe(true);
    expect(isValidSlug('Hello')).toBe(false);
  });
  it('unique slug', () => {
    const set = new Set(['test', 'test-2']);
    expect(uniqueSlug('Test', set)).toBe('test-3');
  });
});
`,
  'date.test.ts': `import { describe, it, expect } from 'vitest';
import { addMinutes, overlaps, formatDuration, isSameDay, startOfDay } from '../utils/date.js';

describe('date utils', () => {
  it('addMinutes', () => {
    const d = new Date('2026-01-01T10:00:00Z');
    expect(addMinutes(d, 30).toISOString()).toBe('2026-01-01T10:30:00.000Z');
  });
  it('overlaps', () => {
    const a1 = new Date('2026-01-01T09:00:00Z');
    const a2 = new Date('2026-01-01T11:00:00Z');
    const b1 = new Date('2026-01-01T10:00:00Z');
    const b2 = new Date('2026-01-01T12:00:00Z');
    expect(overlaps(a1, a2, b1, b2)).toBe(true);
  });
  it('formatDuration', () => {
    expect(formatDuration(90)).toBe('1h 30m');
  });
  it('isSameDay', () => {
    expect(isSameDay(new Date('2026-01-01T08:00:00Z'), new Date('2026-01-01T20:00:00Z'))).toBe(true);
  });
  it('startOfDay', () => {
    const d = startOfDay(new Date('2026-01-01T15:30:00Z'));
    expect(d.getHours()).toBe(0);
  });
});
`,
  'money.test.ts': `import { describe, it, expect } from 'vitest';
import { money, addMoney, formatMoney, sumMoney, dollarsToCents } from '../utils/money.js';

describe('money utils', () => {
  it('creates money', () => {
    expect(money(1000)).toEqual({ amountCents: 1000, currency: 'USD' });
  });
  it('adds money', () => {
    expect(addMoney(money(100), money(50)).amountCents).toBe(150);
  });
  it('formats money', () => {
    expect(formatMoney(money(1099))).toContain('10.99');
  });
  it('sums money', () => {
    expect(sumMoney([money(100), money(200)]).amountCents).toBe(300);
  });
  it('dollarsToCents', () => {
    expect(dollarsToCents(19.99)).toBe(1999);
  });
});
`,
  'events.test.ts': `import { describe, it, expect } from 'vitest';
import { WaypointEvents, createEventPayload } from '../events.js';

describe('events', () => {
  it('has stable event names', () => {
    expect(WaypointEvents.BOOKING_CREATED).toBe('waypoint.booking.created');
  });
  it('creates payload', () => {
    const p = createEventPayload(WaypointEvents.USER_CREATED, 'org-1', { id: 'u1' }, 'corr-1');
    expect(p.orgId).toBe('org-1');
    expect(p.correlationId).toBe('corr-1');
  });
});
`,
  'pagination.test.ts': `import { describe, it, expect } from 'vitest';
import { paginate } from '../types/pagination.js';

describe('paginate', () => {
  it('paginates items', () => {
    const items = Array.from({ length: 30 }, (_, i) => i);
    const r = paginate(items, 2, 10);
    expect(r.items).toHaveLength(10);
    expect(r.totalPages).toBe(3);
  });
});
`,
};

for (const [file, content] of Object.entries(sharedTests)) {
  write(`packages/shared/src/${file}`, content);
}

// Add more schema tests
const schemaTestNames = ['user', 'org', 'space', 'booking', 'visitor', 'amenity'];
for (const name of schemaTestNames) {
  write(`packages/shared/src/schemas/${name}.test.ts`, `import { describe, it, expect } from 'vitest';
import * as schemas from './${name}.js';

describe('${name} schema', () => {
  it('exports schemas', () => {
    expect(Object.keys(schemas).length).toBeGreaterThan(0);
  });
});
`);
}

console.log('Generated shared package...');
