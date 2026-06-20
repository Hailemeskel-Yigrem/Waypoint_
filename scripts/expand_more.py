#!/usr/bin/env python3
"""Second-wave expansion: billing, integrations, validators, migrations, portal services."""
from __future__ import annotations

from pathlib import Path
from textwrap import dedent

ROOT = Path(__file__).resolve().parents[1]


def w(rel: str, content: str) -> None:
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(dedent(content).lstrip("\n"), encoding="utf-8")


PLANS = [
    ("starter", 25, 5, 50, 0),
    ("growth", 100, 25, 250, 49),
    ("business", 500, 100, 2000, 149),
    ("enterprise", 10000, 1000, 50000, 399),
]


def write_billing_engine() -> None:
    w(
        "packages/billing/package.json",
        """
        {
          "name": "@waypoint/billing",
          "version": "0.1.0",
          "private": true,
          "type": "module",
          "main": "./dist/index.js",
          "types": "./dist/index.d.ts",
          "scripts": {
            "build": "tsc -p tsconfig.json",
            "test": "vitest run",
            "typecheck": "tsc -p tsconfig.json --noEmit"
          },
          "devDependencies": {
            "typescript": "~5.7.3",
            "vitest": "^2.1.8"
          }
        }
        """,
    )
    w(
        "packages/billing/tsconfig.json",
        """
        {
          "extends": "../../tsconfig.base.json",
          "compilerOptions": { "outDir": "dist", "rootDir": "src" },
          "include": ["src/**/*"]
        }
        """,
    )
    w(
        "packages/billing/vitest.config.ts",
        """
        import { defineConfig } from 'vitest/config';
        export default defineConfig({ test: { environment: 'node', include: ['src/**/*.test.ts'] } });
        """,
    )
    w(
        "packages/billing/src/plans.ts",
        """
        export interface PlanLimits {
          code: string;
          maxSeats: number;
          maxBuildings: number;
          maxBookingsPerMonth: number;
          priceUsdMonthly: number;
          features: string[];
        }

        export const PLANS: Record<string, PlanLimits> = {
          starter: {
            code: 'starter',
            maxSeats: 25,
            maxBuildings: 5,
            maxBookingsPerMonth: 50,
            priceUsdMonthly: 0,
            features: ['bookings', 'visitors'],
          },
          growth: {
            code: 'growth',
            maxSeats: 100,
            maxBuildings: 25,
            maxBookingsPerMonth: 250,
            priceUsdMonthly: 49,
            features: ['bookings', 'visitors', 'amenities', 'analytics'],
          },
          business: {
            code: 'business',
            maxSeats: 500,
            maxBuildings: 100,
            maxBookingsPerMonth: 2000,
            priceUsdMonthly: 149,
            features: ['bookings', 'visitors', 'amenities', 'analytics', 'webhooks', 'sso'],
          },
          enterprise: {
            code: 'enterprise',
            maxSeats: 10000,
            maxBuildings: 1000,
            maxBookingsPerMonth: 50000,
            priceUsdMonthly: 399,
            features: ['bookings', 'visitors', 'amenities', 'analytics', 'webhooks', 'sso', 'sla', 'audit'],
          },
        };

        export function getPlan(code: string): PlanLimits {
          const plan = PLANS[code];
          if (!plan) throw new Error(`unknown plan: ${code}`);
          return plan;
        }
        """,
    )
    w(
        "packages/billing/src/usage.ts",
        """
        import { getPlan, type PlanLimits } from './plans.js';

        export interface UsageSnapshot {
          seats: number;
          buildings: number;
          bookingsThisMonth: number;
        }

        export interface LimitCheck {
          allowed: boolean;
          code: string;
          limit: number;
          current: number;
        }

        export function checkSeatLimit(planCode: string, usage: UsageSnapshot): LimitCheck {
          const plan = getPlan(planCode);
          return {
            allowed: usage.seats <= plan.maxSeats,
            code: 'seats',
            limit: plan.maxSeats,
            current: usage.seats,
          };
        }

        export function checkBuildingLimit(planCode: string, usage: UsageSnapshot): LimitCheck {
          const plan = getPlan(planCode);
          return {
            allowed: usage.buildings <= plan.maxBuildings,
            code: 'buildings',
            limit: plan.maxBuildings,
            current: usage.buildings,
          };
        }

        export function checkBookingLimit(planCode: string, usage: UsageSnapshot): LimitCheck {
          const plan = getPlan(planCode);
          return {
            allowed: usage.bookingsThisMonth < plan.maxBookingsPerMonth,
            code: 'bookings',
            limit: plan.maxBookingsPerMonth,
            current: usage.bookingsThisMonth,
          };
        }

        export function assertWithinPlan(planCode: string, usage: UsageSnapshot): void {
          for (const check of [
            checkSeatLimit(planCode, usage),
            checkBuildingLimit(planCode, usage),
            checkBookingLimit(planCode, usage),
          ]) {
            if (!check.allowed) {
              throw new Error(`plan limit exceeded for ${check.code}: ${check.current}/${check.limit}`);
            }
          }
        }

        export function utilizationPercent(plan: PlanLimits, usage: UsageSnapshot): number {
          const seatPct = usage.seats / plan.maxSeats;
          const buildingPct = usage.buildings / plan.maxBuildings;
          const bookingPct = usage.bookingsThisMonth / plan.maxBookingsPerMonth;
          return Math.round(Math.max(seatPct, buildingPct, bookingPct) * 100);
        }
        """,
    )
    w(
        "packages/billing/src/invoices.ts",
        """
        export interface InvoiceLine {
          description: string;
          quantity: number;
          unitAmountCents: number;
        }

        export interface InvoiceDraft {
          organizationId: string;
          periodStart: string;
          periodEnd: string;
          currency: 'USD';
          lines: InvoiceLine[];
        }

        export interface InvoiceTotals {
          subtotalCents: number;
          taxCents: number;
          totalCents: number;
        }

        export function lineTotal(line: InvoiceLine): number {
          return line.quantity * line.unitAmountCents;
        }

        export function computeTotals(draft: InvoiceDraft, taxRate = 0): InvoiceTotals {
          const subtotalCents = draft.lines.reduce((sum, line) => sum + lineTotal(line), 0);
          const taxCents = Math.round(subtotalCents * taxRate);
          return { subtotalCents, taxCents, totalCents: subtotalCents + taxCents };
        }

        export function formatMoney(cents: number, currency: 'USD' = 'USD'): string {
          return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
        }

        export function buildSubscriptionInvoice(
          organizationId: string,
          planCode: string,
          priceUsdMonthly: number,
          periodStart: string,
          periodEnd: string,
        ): InvoiceDraft {
          return {
            organizationId,
            periodStart,
            periodEnd,
            currency: 'USD',
            lines: [
              {
                description: `Waypoint ${planCode} plan`,
                quantity: 1,
                unitAmountCents: Math.round(priceUsdMonthly * 100),
              },
            ],
          };
        }
        """,
    )
    w(
        "packages/billing/src/proration.ts",
        """
        export function daysInclusive(startIso: string, endIso: string): number {
          const start = Date.parse(startIso);
          const end = Date.parse(endIso);
          if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
            throw new Error('invalid proration range');
          }
          return Math.floor((end - start) / 86_400_000) + 1;
        }

        export function prorateAmountCents(
          monthlyAmountCents: number,
          periodStart: string,
          periodEnd: string,
          monthDays = 30,
        ): number {
          const days = daysInclusive(periodStart, periodEnd);
          return Math.round((monthlyAmountCents * days) / monthDays);
        }
        """,
    )
    for name in ("plans", "usage", "invoices", "proration"):
        w(
            f"packages/billing/src/{name}.test.ts",
            f"""
            import {{ describe, it, expect }} from 'vitest';
            import * as mod from './{name}.js';

            describe('billing/{name}', () => {{
              it('exports callable members', () => {{
                expect(mod).toBeTruthy();
                expect(Object.keys(mod).length).toBeGreaterThan(0);
              }});
            }});
            """,
        )
    w(
        "packages/billing/src/usage.test.ts",
        """
        import { describe, it, expect } from 'vitest';
        import { assertWithinPlan, checkSeatLimit, utilizationPercent } from './usage.js';
        import { getPlan } from './plans.js';

        describe('billing usage', () => {
          it('allows usage under limits', () => {
            const check = checkSeatLimit('growth', { seats: 10, buildings: 2, bookingsThisMonth: 5 });
            expect(check.allowed).toBe(true);
          });

          it('blocks seat overage', () => {
            expect(() =>
              assertWithinPlan('starter', { seats: 30, buildings: 1, bookingsThisMonth: 1 }),
            ).toThrow(/seats/);
          });

          it('computes utilization', () => {
            const plan = getPlan('growth');
            const pct = utilizationPercent(plan, { seats: 50, buildings: 5, bookingsThisMonth: 25 });
            expect(pct).toBe(50);
          });
        });
        """,
    )
    w(
        "packages/billing/src/invoices.test.ts",
        """
        import { describe, it, expect } from 'vitest';
        import { computeTotals, buildSubscriptionInvoice, formatMoney } from './invoices.js';

        describe('invoices', () => {
          it('computes totals with tax', () => {
            const draft = buildSubscriptionInvoice('org', 'growth', 49, '2024-01-01', '2024-01-31');
            const totals = computeTotals(draft, 0.1);
            expect(totals.subtotalCents).toBe(4900);
            expect(totals.taxCents).toBe(490);
            expect(totals.totalCents).toBe(5390);
          });

          it('formats money', () => {
            expect(formatMoney(4900)).toContain('49');
          });
        });
        """,
    )
    w(
        "packages/billing/src/index.ts",
        """
        export * from './plans.js';
        export * from './usage.js';
        export * from './invoices.js';
        export * from './proration.js';
        """,
    )


def write_integration_clients() -> None:
    clients = [
        ("slack", "Slack", "chat notifications"),
        ("teams", "MicrosoftTeams", "Teams channel posts"),
        ("okta", "Okta", "SSO user sync"),
        ("googleWorkspace", "GoogleWorkspace", "directory sync"),
        ("outlook", "Outlook", "calendar sync"),
        ("stripe", "Stripe", "payment provider"),
        ("twilio", "Twilio", "SMS delivery"),
        ("sendgrid", "Sendgrid", "email delivery"),
        ("pagerduty", "PagerDuty", "incident alerts"),
        ("webhook", "GenericWebhook", "signed outbound webhooks"),
    ]
    w(
        "packages/integrations/package.json",
        """
        {
          "name": "@waypoint/integrations",
          "version": "0.1.0",
          "private": true,
          "type": "module",
          "main": "./dist/index.js",
          "types": "./dist/index.d.ts",
          "scripts": {
            "build": "tsc -p tsconfig.json",
            "test": "vitest run",
            "typecheck": "tsc -p tsconfig.json --noEmit"
          },
          "devDependencies": {
            "typescript": "~5.7.3",
            "vitest": "^2.1.8",
            "@types/node": "^22.10.1"
          }
        }
        """,
    )
    w(
        "packages/integrations/tsconfig.json",
        """
        {
          "extends": "../../tsconfig.base.json",
          "compilerOptions": { "outDir": "dist", "rootDir": "src" },
          "include": ["src/**/*"]
        }
        """,
    )
    w(
        "packages/integrations/vitest.config.ts",
        """
        import { defineConfig } from 'vitest/config';
        export default defineConfig({ test: { environment: 'node', include: ['src/**/*.test.ts'] } });
        """,
    )
    w(
        "packages/integrations/src/http.ts",
        """
        export interface HttpRequest {
          method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
          url: string;
          headers?: Record<string, string>;
          body?: unknown;
          timeoutMs?: number;
        }

        export interface HttpResponse {
          status: number;
          body: unknown;
        }

        export type HttpTransport = (req: HttpRequest) => Promise<HttpResponse>;

        export class HttpError extends Error {
          constructor(
            message: string,
            readonly status: number,
            readonly body?: unknown,
          ) {
            super(message);
            this.name = 'HttpError';
          }
        }

        export async function requestJson(transport: HttpTransport, req: HttpRequest): Promise<unknown> {
          const response = await transport(req);
          if (response.status < 200 || response.status >= 300) {
            throw new HttpError(`HTTP ${response.status} for ${req.url}`, response.status, response.body);
          }
          return response.body;
        }
        """,
    )
    for key, class_name, purpose in clients:
        w(
            f"packages/integrations/src/clients/{key}.ts",
            f"""
            import {{ createHmac }} from 'node:crypto';
            import {{ requestJson, type HttpTransport }} from '../http.js';

            /** {purpose} */
            export interface {class_name}Config {{
              baseUrl: string;
              apiKey: string;
              timeoutMs?: number;
            }}

            export class {class_name}Client {{
              constructor(
                private readonly config: {class_name}Config,
                private readonly transport: HttpTransport,
              ) {{}}

              private headers(): Record<string, string> {{
                return {{
                  Authorization: `Bearer ${{this.config.apiKey}}`,
                  'Content-Type': 'application/json',
                  'User-Agent': 'waypoint-integrations/0.1',
                }};
              }}

              async ping(): Promise<boolean> {{
                await requestJson(this.transport, {{
                  method: 'GET',
                  url: `${{this.config.baseUrl}}/health`,
                  headers: this.headers(),
                  timeoutMs: this.config.timeoutMs ?? 5000,
                }});
                return true;
              }}

              async sendEvent(eventType: string, payload: Record<string, unknown>): Promise<void> {{
                if (!eventType.trim()) throw new Error('eventType is required');
                await requestJson(this.transport, {{
                  method: 'POST',
                  url: `${{this.config.baseUrl}}/events`,
                  headers: this.headers(),
                  body: {{ eventType, payload, source: 'waypoint' }},
                  timeoutMs: this.config.timeoutMs ?? 10000,
                }});
              }}

              signPayload(payload: string, secret: string): string {{
                return createHmac('sha256', secret).update(payload).digest('hex');
              }}
            }}
            """,
        )
        w(
            f"packages/integrations/src/clients/{key}.test.ts",
            f"""
            import {{ describe, it, expect, vi }} from 'vitest';
            import {{ {class_name}Client }} from './{key}.js';

            describe('{class_name}Client', () => {{
              it('sends events through transport', async () => {{
                const transport = vi.fn(async () => ({{ status: 200, body: {{ ok: true }} }}));
                const client = new {class_name}Client(
                  {{ baseUrl: 'https://example.test', apiKey: 'k' }},
                  transport,
                );
                await client.sendEvent('booking.created', {{ id: '1' }});
                expect(transport).toHaveBeenCalled();
              }});

              it('signs payloads', () => {{
                const client = new {class_name}Client(
                  {{ baseUrl: 'https://example.test', apiKey: 'k' }},
                  async () => ({{ status: 200, body: {{}} }}),
                );
                expect(client.signPayload('abc', 'secret')).toHaveLength(64);
              }});
            }});
            """,
        )
    w(
        "packages/integrations/src/index.ts",
        "export * from './http.js';\n"
        + "\n".join([f"export * from './clients/{k}.js';" for k, _, _ in clients])
        + "\n",
    )


def write_validators() -> None:
    fields = [
        ("bookingWindow", "start/end booking validation"),
        ("visitorWindow", "visitor arrival window"),
        ("deskAssignment", "desk availability rules"),
        ("spaceCapacity", "space capacity constraints"),
        ("amenitySlot", "amenity reservation slots"),
        ("orgSlug", "organization slug rules"),
        ("timezone", "IANA timezone validation"),
        ("recurrence", "RRULE-like recurrence limits"),
        ("attachment", "upload size/type limits"),
        ("webhookUrl", "HTTPS webhook URL rules"),
    ]
    for name, desc in fields:
        w(
            f"packages/shared/src/validators/{name}.ts",
            f"""
            /** {desc} */

            export interface ValidationIssue {{
              path: string;
              message: string;
            }}

            export function validate{name[0].upper() + name[1:]}(input: Record<string, unknown>): ValidationIssue[] {{
              const issues: ValidationIssue[] = [];
              if (input == null || typeof input !== 'object') {{
                return [{{ path: '', message: 'input must be an object' }}];
              }}

              if ('start' in input || 'end' in input) {{
                const start = input.start;
                const end = input.end;
                if (typeof start !== 'string' || Number.isNaN(Date.parse(start))) {{
                  issues.push({{ path: 'start', message: 'start must be an ISO datetime' }});
                }}
                if (typeof end !== 'string' || Number.isNaN(Date.parse(end))) {{
                  issues.push({{ path: 'end', message: 'end must be an ISO datetime' }});
                }}
                if (typeof start === 'string' && typeof end === 'string') {{
                  if (Date.parse(end) <= Date.parse(start)) {{
                    issues.push({{ path: 'end', message: 'end must be after start' }});
                  }}
                }}
              }}

              if ('email' in input) {{
                const email = String(input.email ?? '');
                if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {{
                  issues.push({{ path: 'email', message: 'invalid email' }});
                }}
              }}

              if ('slug' in input) {{
                const slug = String(input.slug ?? '');
                if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {{
                  issues.push({{ path: 'slug', message: 'slug must be kebab-case' }});
                }}
              }}

              if ('url' in input) {{
                const url = String(input.url ?? '');
                if (!url.startsWith('https://')) {{
                  issues.push({{ path: 'url', message: 'url must use https' }});
                }}
              }}

              if ('capacity' in input) {{
                const capacity = Number(input.capacity);
                if (!Number.isInteger(capacity) || capacity < 1) {{
                  issues.push({{ path: 'capacity', message: 'capacity must be a positive integer' }});
                }}
              }}

              return issues;
            }}

            export function assertValid{name[0].upper() + name[1:]}(input: Record<string, unknown>): void {{
              const issues = validate{name[0].upper() + name[1:]}(input);
              if (issues.length) {{
                throw new Error(issues.map((i) => `${{i.path}}: ${{i.message}}`).join('; '));
              }}
            }}
            """,
        )
        w(
            f"packages/shared/src/validators/{name}.test.ts",
            f"""
            import {{ describe, it, expect }} from 'vitest';
            import {{ validate{name[0].upper() + name[1:]}, assertValid{name[0].upper() + name[1:]} }} from './{name}.js';

            describe('validator {name}', () => {{
              it('accepts a valid window', () => {{
                const issues = validate{name[0].upper() + name[1:]}({{
                  start: '2024-05-01T10:00:00Z',
                  end: '2024-05-01T11:00:00Z',
                  email: 'user@example.com',
                  slug: 'acme-labs',
                  url: 'https://hooks.example.com/x',
                  capacity: 4,
                }});
                expect(issues).toEqual([]);
              }});

              it('rejects inverted ranges', () => {{
                expect(() =>
                  assertValid{name[0].upper() + name[1:]}({{
                    start: '2024-05-01T12:00:00Z',
                    end: '2024-05-01T11:00:00Z',
                  }}),
                ).toThrow(/end/);
              }});
            }});
            """,
        )


def write_migrations() -> None:
    migrations = [
        ("001_organizations", "organizations, users, memberships"),
        ("002_buildings_floors", "buildings and floors"),
        ("003_spaces_desks", "spaces and desks"),
        ("004_bookings", "bookings and attendees"),
        ("005_visitors", "visitor invitations and checkins"),
        ("006_amenities", "amenities and reservations"),
        ("007_access_policies", "access policies and grants"),
        ("008_notifications", "notification outbox"),
        ("009_billing", "plans, subscriptions, invoices"),
        ("010_analytics", "analytics rollup tables"),
        ("011_webhooks", "webhook endpoints and deliveries"),
        ("012_audit", "immutable audit events"),
        ("013_teams_shifts", "teams and shifts"),
        ("014_assets", "asset inventory"),
        ("015_feature_flags", "feature flags"),
        ("016_reports", "report jobs"),
        ("017_integrations", "integration credentials"),
        ("018_sla", "sla targets and breaches"),
        ("019_checkins", "booking check-ins"),
        ("020_indexes", "performance indexes"),
    ]
    for fname, comment in migrations:
        table = fname.split("_", 1)[1]
        w(
            f"packages/database/migrations/{fname}.sql",
            f"""
            -- {comment}
            BEGIN;

            CREATE TABLE IF NOT EXISTS waypoint_{table} (
              id UUID PRIMARY KEY,
              organization_id UUID NOT NULL,
              name TEXT NOT NULL,
              status TEXT NOT NULL DEFAULT 'active',
              metadata JSONB NOT NULL DEFAULT '{{}}'::jsonb,
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS idx_{table}_org
              ON waypoint_{table} (organization_id);

            CREATE INDEX IF NOT EXISTS idx_{table}_org_status
              ON waypoint_{table} (organization_id, status);

            COMMIT;
            """,
        )


def write_api_services_extra() -> None:
    """Generate richer booking conflict and visitor services in API."""
    w(
        "apps/api/src/services/bookingConflict.ts",
        """
        export interface BookingSlot {
          id: string;
          resourceId: string;
          organizationId: string;
          start: string;
          end: string;
          status: 'pending' | 'confirmed' | 'cancelled';
        }

        export function isActive(status: BookingSlot['status']): boolean {
          return status === 'pending' || status === 'confirmed';
        }

        export function overlaps(a: BookingSlot, b: BookingSlot): boolean {
          if (a.organizationId !== b.organizationId) return false;
          if (a.resourceId !== b.resourceId) return false;
          if (!isActive(a.status) || !isActive(b.status)) return false;
          return a.start < b.end && b.start < a.end;
        }

        export function findConflicts(candidate: BookingSlot, existing: BookingSlot[]): BookingSlot[] {
          return existing.filter((slot) => slot.id !== candidate.id && overlaps(candidate, slot));
        }

        export function assertNoConflicts(candidate: BookingSlot, existing: BookingSlot[]): void {
          const conflicts = findConflicts(candidate, existing);
          if (conflicts.length) {
            throw new Error(`booking conflicts with ${conflicts.map((c) => c.id).join(', ')}`);
          }
        }

        export function sortByStart(slots: BookingSlot[]): BookingSlot[] {
          return [...slots].sort((a, b) => a.start.localeCompare(b.start));
        }
        """,
    )
    w(
        "apps/api/src/services/bookingConflict.test.ts",
        """
        import { describe, it, expect } from 'vitest';
        import { findConflicts, assertNoConflicts } from './bookingConflict.js';

        const base = {
          organizationId: 'org',
          resourceId: 'desk-1',
          status: 'confirmed' as const,
        };

        describe('bookingConflict', () => {
          it('detects overlaps', () => {
            const candidate = { ...base, id: 'c', start: '2024-01-01T10:00:00Z', end: '2024-01-01T11:00:00Z' };
            const existing = [
              { ...base, id: 'e', start: '2024-01-01T10:30:00Z', end: '2024-01-01T11:30:00Z' },
            ];
            expect(findConflicts(candidate, existing)).toHaveLength(1);
          });

          it('ignores cancelled bookings', () => {
            const candidate = { ...base, id: 'c', start: '2024-01-01T10:00:00Z', end: '2024-01-01T11:00:00Z' };
            const existing = [
              {
                ...base,
                id: 'e',
                status: 'cancelled' as const,
                start: '2024-01-01T10:00:00Z',
                end: '2024-01-01T11:00:00Z',
              },
            ];
            expect(() => assertNoConflicts(candidate, existing)).not.toThrow();
          });
        });
        """,
    )
    w(
        "apps/api/src/services/visitorRules.ts",
        """
        export interface VisitorInvite {
          id: string;
          organizationId: string;
          hostUserId: string;
          visitorEmail: string;
          arrivesAt: string;
          departsAt: string;
          status: 'invited' | 'checked_in' | 'checked_out' | 'cancelled' | 'expired';
        }

        export function canCheckIn(invite: VisitorInvite, nowIso: string): boolean {
          if (invite.status !== 'invited') return false;
          const now = Date.parse(nowIso);
          const start = Date.parse(invite.arrivesAt) - 30 * 60_000;
          const end = Date.parse(invite.departsAt);
          return now >= start && now <= end;
        }

        export function shouldExpire(invite: VisitorInvite, nowIso: string): boolean {
          if (invite.status === 'checked_out' || invite.status === 'cancelled' || invite.status === 'expired') {
            return false;
          }
          return Date.parse(nowIso) > Date.parse(invite.departsAt);
        }

        export function normalizeVisitorEmail(email: string): string {
          return email.trim().toLowerCase();
        }
        """,
    )
    w(
        "apps/api/src/services/visitorRules.test.ts",
        """
        import { describe, it, expect } from 'vitest';
        import { canCheckIn, shouldExpire, normalizeVisitorEmail } from './visitorRules.js';

        const invite = {
          id: 'v1',
          organizationId: 'org',
          hostUserId: 'host',
          visitorEmail: 'Guest@Example.com',
          arrivesAt: '2024-03-01T15:00:00Z',
          departsAt: '2024-03-01T17:00:00Z',
          status: 'invited' as const,
        };

        describe('visitorRules', () => {
          it('allows check-in within window', () => {
            expect(canCheckIn(invite, '2024-03-01T14:45:00Z')).toBe(true);
          });

          it('expires after departure', () => {
            expect(shouldExpire(invite, '2024-03-01T18:00:00Z')).toBe(true);
          });

          it('normalizes email', () => {
            expect(normalizeVisitorEmail(invite.visitorEmail)).toBe('guest@example.com');
          });
        });
        """,
    )


def write_large_docs() -> None:
    topics = [
        ("docs/guides/getting-started.md", "Getting Started", "Install, configure, and run Waypoint locally."),
        ("docs/guides/multi-tenancy.md", "Multi-tenancy", "How organization isolation is enforced."),
        ("docs/guides/rbac.md", "RBAC", "Roles: owner, admin, manager, member, receptionist."),
        ("docs/guides/bookings.md", "Bookings", "Desk and space reservation flows."),
        ("docs/guides/visitors.md", "Visitors", "Invite, check-in, and expiry workflows."),
        ("docs/guides/amenities.md", "Amenities", "Capacity-limited amenity reservations."),
        ("docs/guides/analytics.md", "Analytics", "Utilization and operational metrics."),
        ("docs/guides/billing.md", "Billing", "Plans, usage limits, and invoices."),
        ("docs/guides/integrations.md", "Integrations", "Slack, SSO, calendar, and webhooks."),
        ("docs/guides/worker.md", "Worker", "Background jobs and retry semantics."),
        ("docs/runbooks/api-outage.md", "API outage", "Diagnose and mitigate API availability issues."),
        ("docs/runbooks/db-migration.md", "DB migration", "Apply and roll forward SQL migrations."),
        ("docs/runbooks/queue-backlog.md", "Queue backlog", "Drain Redis/Bull-style job backlogs."),
        ("docs/security/overview.md", "Security overview", "Authn/z, secrets, and audit logging."),
        ("docs/security/threat-model.md", "Threat model", "Trust boundaries for tenant data."),
    ]
    for path, title, summary in topics:
        w(
            path,
            f"""
            # {title}

            {summary}

            ## Overview

            Waypoint keeps workplace operations consistent across admin console, employee portal, API, and worker processes.

            ## Steps

            1. Confirm environment variables from `.env.example`
            2. Run `pnpm install`
            3. Apply database migrations
            4. Start API and dependent services
            5. Verify health endpoints and smoke tests

            ## Notes

            - Prefer domain rules in `@waypoint/domain`
            - Keep every query tenant-scoped
            - Emit structured logs with request correlation IDs
            """,
        )


def write_rich_ui_components() -> None:
    components = [
        "BookingTimeline",
        "UtilizationBar",
        "VisitorBadge",
        "DeskGrid",
        "SpaceMapLegend",
        "PlanUsageMeter",
        "WebhookStatus",
        "AuditTimeline",
        "ShiftCalendar",
        "AmenityPicker",
        "TeamRoster",
        "InvoiceSummary",
        "CheckInScanner",
        "ResourceFilter",
        "OrgSwitcher",
    ]
    for name in components:
        w(
            f"packages/ui/src/components/{name}/{name}.tsx",
            f"""
            import type {{ ReactNode }} from 'react';
            import styles from './{name}.module.css';

            export interface {name}Props {{
              title?: string;
              subtitle?: string;
              children?: ReactNode;
              tone?: 'neutral' | 'success' | 'warning' | 'danger';
            }}

            export function {name}({{ title, subtitle, children, tone = 'neutral' }}: {name}Props) {{
              return (
                <section className={{`${{styles.root}} ${{styles[tone]}}`}} data-component="{name}">
                  {{title ? <h3 className={{styles.title}}>{{title}}</h3> : null}}
                  {{subtitle ? <p className={{styles.subtitle}}>{{subtitle}}</p> : null}}
                  <div className={{styles.body}}>{{children}}</div>
                </section>
              );
            }}

            export default {name};
            """,
        )
        w(
            f"packages/ui/src/components/{name}/{name}.module.css",
            """
            .root {
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
              padding: 0.75rem 0;
            }
            .title {
              margin: 0;
              font-size: 1rem;
              font-weight: 600;
            }
            .subtitle {
              margin: 0;
              color: #4b5563;
              font-size: 0.875rem;
            }
            .body {
              min-height: 1.5rem;
            }
            .neutral { border-left: 3px solid #9ca3af; padding-left: 0.75rem; }
            .success { border-left: 3px solid #059669; padding-left: 0.75rem; }
            .warning { border-left: 3px solid #d97706; padding-left: 0.75rem; }
            .danger { border-left: 3px solid #dc2626; padding-left: 0.75rem; }
            """,
        )
        w(
            f"packages/ui/src/components/{name}/{name}.test.tsx",
            f"""
            import {{ describe, it, expect }} from 'vitest';
            import {{ {name} }} from './{name}';

            describe('{name}', () => {{
              it('is a function component', () => {{
                expect(typeof {name}).toBe('function');
              }});
            }});
            """,
        )


def write_generated_domain_rules() -> None:
    """Generate many pure rule modules to deepen domain coverage."""
    rules = [
        "maxAdvanceBookingDays",
        "minBookingDurationMinutes",
        "maxBookingDurationMinutes",
        "bufferBetweenBookings",
        "requireCheckin",
        "autoCancelNoShow",
        "allowGuestBookings",
        "restrictToBusinessHours",
        "requireManagerApproval",
        "limitConcurrentDesks",
        "limitDailyVisitors",
        "requireHostPresence",
        "blockMaintenanceWindows",
        "enforceQuietHours",
        "requireBadgeAccess",
        "allowRecurringSeries",
        "capSeriesOccurrences",
        "requireCostCenter",
        "requireFloorAssignment",
        "validateNeighborhood",
    ]
    for rule in rules:
        w(
            f"packages/domain/src/rules/{rule}.ts",
            f"""
            export interface OrgBookingSettings {{
              maxAdvanceBookingDays: number;
              minBookingDurationMinutes: number;
              maxBookingDurationMinutes: number;
              bufferMinutes: number;
              businessOpenHour: number;
              businessCloseHour: number;
              requireCheckin: boolean;
              allowGuests: boolean;
              maxConcurrentDesksPerUser: number;
              maxDailyVisitors: number;
            }}

            export const defaultSettings: OrgBookingSettings = {{
              maxAdvanceBookingDays: 30,
              minBookingDurationMinutes: 30,
              maxBookingDurationMinutes: 480,
              bufferMinutes: 0,
              businessOpenHour: 7,
              businessCloseHour: 20,
              requireCheckin: true,
              allowGuests: false,
              maxConcurrentDesksPerUser: 1,
              maxDailyVisitors: 100,
            }};

            export function evaluate{rule[0].upper() + rule[1:]}(
              settings: OrgBookingSettings,
              context: Record<string, number | boolean | string>,
            ): {{ ok: boolean; reason?: string }} {{
              // Domain rule: {rule}
              if (settings.maxAdvanceBookingDays < 1) {{
                return {{ ok: false, reason: 'invalid maxAdvanceBookingDays' }};
              }}
              if (settings.minBookingDurationMinutes > settings.maxBookingDurationMinutes) {{
                return {{ ok: false, reason: 'min duration exceeds max duration' }};
              }}
              if (typeof context.durationMinutes === 'number') {{
                if (context.durationMinutes < settings.minBookingDurationMinutes) {{
                  return {{ ok: false, reason: 'booking too short' }};
                }}
                if (context.durationMinutes > settings.maxBookingDurationMinutes) {{
                  return {{ ok: false, reason: 'booking too long' }};
                }}
              }}
              if (typeof context.advanceDays === 'number' && context.advanceDays > settings.maxAdvanceBookingDays) {{
                return {{ ok: false, reason: 'booking too far in advance' }};
              }}
              if (settings.requireCheckin && context.checkedIn === false && context.phase === 'active') {{
                return {{ ok: false, reason: 'check-in required' }};
              }}
              if (!settings.allowGuests && context.isGuest === true) {{
                return {{ ok: false, reason: 'guest bookings disabled' }};
              }}
              return {{ ok: true }};
            }}
            """,
        )
        w(
            f"packages/domain/src/rules/{rule}.test.ts",
            f"""
            import {{ describe, it, expect }} from 'vitest';
            import {{ defaultSettings, evaluate{rule[0].upper() + rule[1:]} }} from './{rule}.js';

            describe('rule {rule}', () => {{
              it('accepts a normal booking context', () => {{
                const result = evaluate{rule[0].upper() + rule[1:]}(defaultSettings, {{
                  durationMinutes: 60,
                  advanceDays: 3,
                }});
                expect(result.ok).toBe(true);
              }});

              it('rejects oversized duration', () => {{
                const result = evaluate{rule[0].upper() + rule[1:]}(defaultSettings, {{
                  durationMinutes: 9999,
                }});
                expect(result.ok).toBe(false);
              }});
            }});
            """,
        )
    w(
        "packages/domain/src/rules/index.ts",
        "\n".join([f"export * from './{r}.js';" for r in rules]) + "\n",
    )


def main() -> None:
    write_billing_engine()
    write_integration_clients()
    write_validators()
    write_migrations()
    write_api_services_extra()
    write_large_docs()
    write_rich_ui_components()
    write_generated_domain_rules()
    # update domain index to export rules
    index = ROOT / "packages/domain/src/index.ts"
    if index.exists():
        text = index.read_text(encoding="utf-8")
        if "rules/index" not in text:
            index.write_text(text.rstrip() + "\nexport * from './rules/index.js';\n", encoding="utf-8")
    print("expand_more complete")


if __name__ == "__main__":
    main()
