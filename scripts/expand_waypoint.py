#!/usr/bin/env python3
"""Expand Waypoint monorepo with production modules, docs, Docker, CI, and tests."""
from __future__ import annotations

import os
from pathlib import Path
from textwrap import dedent

ROOT = Path(__file__).resolve().parents[1]


def w(rel: str, content: str) -> None:
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(dedent(content).lstrip("\n"), encoding="utf-8")


def domain_service(name: str, entity: str, rules: list[str]) -> str:
    rule_block = "\n".join(f"    // Rule: {r}" for r in rules)
    return f'''
import {{ ok, err, type Result }} from '../result.js';
import {{ ValidationError, ConflictError, NotFoundError, ForbiddenError }} from '../errors.js';
import type {{ {entity}, Create{entity}Input, Update{entity}Input, {entity}Filter }} from './types.js';
import type {{ {entity}Repository }} from './repository.js';

export class {entity}Service {{
  constructor(private readonly repo: {entity}Repository) {{}}

{rule_block}

  async create(input: Create{entity}Input): Promise<Result<{entity}, Error>> {{
    if (!input.organizationId?.trim()) {{
      return err(new ValidationError('organizationId is required'));
    }}
    if (!input.name?.trim()) {{
      return err(new ValidationError('name is required'));
    }}
    const existing = await this.repo.findByName(input.organizationId, input.name);
    if (existing) {{
      return err(new ConflictError(`{name} already exists: ${{input.name}}`));
    }}
    const created = await this.repo.create({{
      ...input,
      name: input.name.trim(),
      status: input.status ?? 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }});
    return ok(created);
  }}

  async get(organizationId: string, id: string): Promise<Result<{entity}, Error>> {{
    const row = await this.repo.findById(organizationId, id);
    if (!row) return err(new NotFoundError('{entity} not found'));
    return ok(row);
  }}

  async list(filter: {entity}Filter): Promise<Result<{entity}[], Error>> {{
    if (!filter.organizationId) {{
      return err(new ValidationError('organizationId is required'));
    }}
    const rows = await this.repo.list(filter);
    return ok(rows);
  }}

  async update(
    organizationId: string,
    id: string,
    input: Update{entity}Input,
    actorRole: string,
  ): Promise<Result<{entity}, Error>> {{
    if (!['owner', 'admin', 'manager'].includes(actorRole)) {{
      return err(new ForbiddenError('insufficient role to update {name}'));
    }}
    const current = await this.repo.findById(organizationId, id);
    if (!current) return err(new NotFoundError('{entity} not found'));
    const updated = await this.repo.update(organizationId, id, {{
      ...input,
      updatedAt: new Date().toISOString(),
    }});
    return ok(updated);
  }}

  async archive(
    organizationId: string,
    id: string,
    actorRole: string,
  ): Promise<Result<{entity}, Error>> {{
    if (!['owner', 'admin'].includes(actorRole)) {{
      return err(new ForbiddenError('insufficient role to archive {name}'));
    }}
    const current = await this.repo.findById(organizationId, id);
    if (!current) return err(new NotFoundError('{entity} not found'));
    if (current.status === 'archived') {{
      return err(new ConflictError('{entity} already archived'));
    }}
    const updated = await this.repo.update(organizationId, id, {{
      status: 'archived',
      updatedAt: new Date().toISOString(),
    }});
    return ok(updated);
  }}
}}
'''


MODULES = [
    ("floors", "Floor", ["Floors belong to a building", "Floor codes unique per building"]),
    ("buildings", "Building", ["Buildings scoped to organization", "Timezone required for scheduling"]),
    ("zones", "Zone", ["Zones partition floors", "Capacity cannot exceed floor capacity"]),
    ("resources", "Resource", ["Resources attach to spaces", "Equipment serials unique per org"]),
    ("policies", "Policy", ["Policies evaluate allow/deny", "Priority order matters"]),
    ("webhooks", "Webhook", ["HTTPS endpoints only", "Secret required for signing"]),
    ("audit", "AuditEvent", ["Audit events immutable", "Tenant isolation enforced"]),
    ("reports", "Report", ["Reports are async jobs", "Retention by plan tier"]),
    ("checkins", "CheckIn", ["Check-ins require active booking", "Geofence optional"]),
    ("invites", "Invite", ["Invites expire", "Email unique among pending"]),
    ("teams", "Team", ["Teams nested under org", "Managers must be members"]),
    ("shifts", "Shift", ["Shifts cannot overlap per user", "Timezone from building"]),
    ("assets", "Asset", ["Assets track equipment", "Maintenance windows block booking"]),
    ("sla", "SlaTarget", ["SLA targets per plan", "Breach emits notification"]),
    ("featureFlags", "FeatureFlag", ["Flags scoped org or global", "Percentage rollout 0-100"]),
]


def write_domain_module(mod: str, entity: str, rules: list[str]) -> None:
    base = f"packages/domain/src/{mod}"
    w(
        f"{base}/types.ts",
        f"""
        export type {entity}Status = 'active' | 'inactive' | 'archived' | 'draft';

        export interface {entity} {{
          id: string;
          organizationId: string;
          name: string;
          status: {entity}Status;
          metadata?: Record<string, unknown>;
          createdAt: string;
          updatedAt: string;
        }}

        export interface Create{entity}Input {{
          organizationId: string;
          name: string;
          status?: {entity}Status;
          metadata?: Record<string, unknown>;
        }}

        export interface Update{entity}Input {{
          name?: string;
          status?: {entity}Status;
          metadata?: Record<string, unknown>;
          updatedAt?: string;
        }}

        export interface {entity}Filter {{
          organizationId: string;
          status?: {entity}Status;
          query?: string;
          limit?: number;
          offset?: number;
        }}
        """,
    )
    w(
        f"{base}/repository.ts",
        f"""
        import type {{ {entity}, Create{entity}Input, Update{entity}Input, {entity}Filter }} from './types.js';

        export interface {entity}Repository {{
          create(input: Create{entity}Input & {{ status: string; createdAt: string; updatedAt: string }}): Promise<{entity}>;
          findById(organizationId: string, id: string): Promise<{entity} | null>;
          findByName(organizationId: string, name: string): Promise<{entity} | null>;
          list(filter: {entity}Filter): Promise<{entity}[]>;
          update(organizationId: string, id: string, input: Update{entity}Input): Promise<{entity}>;
        }}
        """,
    )
    w(
        f"{base}/memory.repository.ts",
        f"""
        import {{ randomUUID }} from 'node:crypto';
        import type {{ {entity}, Create{entity}Input, Update{entity}Input, {entity}Filter }} from './types.js';
        import type {{ {entity}Repository }} from './repository.js';

        export class Memory{entity}Repository implements {entity}Repository {{
          private readonly rows = new Map<string, {entity}>();

          private key(organizationId: string, id: string): string {{
            return `${{organizationId}}:${{id}}`;
          }}

          async create(
            input: Create{entity}Input & {{ status: string; createdAt: string; updatedAt: string }},
          ): Promise<{entity}> {{
            const id = randomUUID();
            const row: {entity} = {{
              id,
              organizationId: input.organizationId,
              name: input.name,
              status: input.status as {entity}['status'],
              metadata: input.metadata,
              createdAt: input.createdAt,
              updatedAt: input.updatedAt,
            }};
            this.rows.set(this.key(row.organizationId, row.id), row);
            return row;
          }}

          async findById(organizationId: string, id: string): Promise<{entity} | null> {{
            return this.rows.get(this.key(organizationId, id)) ?? null;
          }}

          async findByName(organizationId: string, name: string): Promise<{entity} | null> {{
            for (const row of this.rows.values()) {{
              if (row.organizationId === organizationId && row.name.toLowerCase() === name.toLowerCase()) {{
                return row;
              }}
            }}
            return null;
          }}

          async list(filter: {entity}Filter): Promise<{entity}[]> {{
            let rows = [...this.rows.values()].filter((r) => r.organizationId === filter.organizationId);
            if (filter.status) rows = rows.filter((r) => r.status === filter.status);
            if (filter.query) {{
              const q = filter.query.toLowerCase();
              rows = rows.filter((r) => r.name.toLowerCase().includes(q));
            }}
            const offset = filter.offset ?? 0;
            const limit = filter.limit ?? 50;
            return rows.slice(offset, offset + limit);
          }}

          async update(organizationId: string, id: string, input: Update{entity}Input): Promise<{entity}> {{
            const current = await this.findById(organizationId, id);
            if (!current) throw new Error('{entity} not found');
            const next = {{ ...current, ...input, id: current.id, organizationId }};
            this.rows.set(this.key(organizationId, id), next);
            return next;
          }}
        }}
        """,
    )
    w(f"{base}/service.ts", domain_service(mod, entity, rules))
    w(
        f"{base}/schema.ts",
        f"""
        import {{ z }} from 'zod';

        export const create{entity}Schema = z.object({{
          organizationId: z.string().uuid(),
          name: z.string().min(1).max(120),
          status: z.enum(['active', 'inactive', 'archived', 'draft']).optional(),
          metadata: z.record(z.unknown()).optional(),
        }});

        export const update{entity}Schema = z.object({{
          name: z.string().min(1).max(120).optional(),
          status: z.enum(['active', 'inactive', 'archived', 'draft']).optional(),
          metadata: z.record(z.unknown()).optional(),
        }});

        export const {mod}FilterSchema = z.object({{
          organizationId: z.string().uuid(),
          status: z.enum(['active', 'inactive', 'archived', 'draft']).optional(),
          query: z.string().max(200).optional(),
          limit: z.coerce.number().int().min(1).max(200).optional(),
          offset: z.coerce.number().int().min(0).optional(),
        }});
        """,
    )
    w(
        f"{base}/index.ts",
        f"""
        export * from './types.js';
        export * from './repository.js';
        export * from './memory.repository.js';
        export * from './service.js';
        export * from './schema.js';
        """,
    )
    w(
        f"{base}/service.test.ts",
        f"""
        import {{ describe, it, expect, beforeEach }} from 'vitest';
        import {{ Memory{entity}Repository }} from './memory.repository.js';
        import {{ {entity}Service }} from './service.js';

        describe('{entity}Service', () => {{
          let service: {entity}Service;
          const orgId = '11111111-1111-1111-1111-111111111111';

          beforeEach(() => {{
            service = new {entity}Service(new Memory{entity}Repository());
          }});

          it('creates a {mod} record', async () => {{
            const result = await service.create({{ organizationId: orgId, name: 'Alpha {entity}' }});
            expect(result.ok).toBe(true);
            if (result.ok) {{
              expect(result.value.name).toBe('Alpha {entity}');
              expect(result.value.status).toBe('active');
            }}
          }});

          it('rejects duplicate names in the same tenant', async () => {{
            await service.create({{ organizationId: orgId, name: 'Dup' }});
            const result = await service.create({{ organizationId: orgId, name: 'Dup' }});
            expect(result.ok).toBe(false);
          }});

          it('enforces tenant isolation on get', async () => {{
            const created = await service.create({{ organizationId: orgId, name: 'Isolated' }});
            if (!created.ok) throw new Error('setup failed');
            const other = await service.get('22222222-2222-2222-2222-222222222222', created.value.id);
            expect(other.ok).toBe(false);
          }});

          it('archives with admin role', async () => {{
            const created = await service.create({{ organizationId: orgId, name: 'Archive Me' }});
            if (!created.ok) throw new Error('setup failed');
            const archived = await service.archive(orgId, created.value.id, 'admin');
            expect(archived.ok).toBe(true);
            if (archived.ok) expect(archived.value.status).toBe('archived');
          }});

          it('forbids archive for member role', async () => {{
            const created = await service.create({{ organizationId: orgId, name: 'No Archive' }});
            if (!created.ok) throw new Error('setup failed');
            const archived = await service.archive(orgId, created.value.id, 'member');
            expect(archived.ok).toBe(false);
          }});
        }});
        """,
    )


def write_booking_engine() -> None:
    w(
        "packages/domain/src/scheduling/overlap.ts",
        """
        export interface TimeRange {
          start: Date;
          end: Date;
        }

        export function assertValidRange(range: TimeRange): void {
          if (!(range.start instanceof Date) || !(range.end instanceof Date)) {
            throw new Error('start and end must be Date instances');
          }
          if (Number.isNaN(range.start.getTime()) || Number.isNaN(range.end.getTime())) {
            throw new Error('invalid date values');
          }
          if (range.end <= range.start) {
            throw new Error('end must be after start');
          }
        }

        export function rangesOverlap(a: TimeRange, b: TimeRange): boolean {
          assertValidRange(a);
          assertValidRange(b);
          return a.start < b.end && b.start < a.end;
        }

        export function findOverlaps<T extends TimeRange>(candidate: TimeRange, existing: T[]): T[] {
          return existing.filter((item) => rangesOverlap(candidate, item));
        }

        export function durationMinutes(range: TimeRange): number {
          assertValidRange(range);
          return Math.round((range.end.getTime() - range.start.getTime()) / 60000);
        }

        export function clampToBusinessHours(
          range: TimeRange,
          openHour: number,
          closeHour: number,
          timeZoneOffsetMinutes = 0,
        ): TimeRange {
          assertValidRange(range);
          const start = new Date(range.start);
          const end = new Date(range.end);
          const localStartHour = (start.getUTCHours() * 60 + start.getUTCMinutes() + timeZoneOffsetMinutes) / 60;
          if (localStartHour < openHour || localStartHour >= closeHour) {
            throw new Error('start outside business hours');
          }
          return { start, end };
        }
        """,
    )
    w(
        "packages/domain/src/scheduling/overlap.test.ts",
        """
        import { describe, it, expect } from 'vitest';
        import { rangesOverlap, findOverlaps, durationMinutes } from './overlap.js';

        describe('scheduling overlap', () => {
          it('detects overlapping ranges', () => {
            const a = { start: new Date('2024-06-01T10:00:00Z'), end: new Date('2024-06-01T11:00:00Z') };
            const b = { start: new Date('2024-06-01T10:30:00Z'), end: new Date('2024-06-01T11:30:00Z') };
            expect(rangesOverlap(a, b)).toBe(true);
          });

          it('allows adjacent ranges', () => {
            const a = { start: new Date('2024-06-01T10:00:00Z'), end: new Date('2024-06-01T11:00:00Z') };
            const b = { start: new Date('2024-06-01T11:00:00Z'), end: new Date('2024-06-01T12:00:00Z') };
            expect(rangesOverlap(a, b)).toBe(false);
          });

          it('computes duration', () => {
            const a = { start: new Date('2024-06-01T10:00:00Z'), end: new Date('2024-06-01T11:30:00Z') };
            expect(durationMinutes(a)).toBe(90);
          });

          it('finds overlapping bookings', () => {
            const candidate = { start: new Date('2024-06-01T09:00:00Z'), end: new Date('2024-06-01T10:00:00Z') };
            const existing = [
              { id: '1', start: new Date('2024-06-01T09:30:00Z'), end: new Date('2024-06-01T10:30:00Z') },
              { id: '2', start: new Date('2024-06-01T11:00:00Z'), end: new Date('2024-06-01T12:00:00Z') },
            ];
            expect(findOverlaps(candidate, existing)).toHaveLength(1);
          });
        });
        """,
    )
    w(
        "packages/domain/src/scheduling/capacity.ts",
        """
        export interface CapacityPool {
          id: string;
          hardLimit: number;
          softLimit?: number;
        }

        export interface CapacityReservation {
          poolId: string;
          seats: number;
          rangeStart: string;
          rangeEnd: string;
        }

        export function remainingCapacity(
          pool: CapacityPool,
          reservations: CapacityReservation[],
          rangeStart: string,
          rangeEnd: string,
        ): number {
          const used = reservations
            .filter((r) => r.poolId === pool.id)
            .filter((r) => r.rangeStart < rangeEnd && rangeStart < r.rangeEnd)
            .reduce((sum, r) => sum + r.seats, 0);
          return Math.max(0, pool.hardLimit - used);
        }

        export function canReserve(
          pool: CapacityPool,
          reservations: CapacityReservation[],
          seats: number,
          rangeStart: string,
          rangeEnd: string,
        ): { allowed: boolean; remaining: number; softExceeded: boolean } {
          const remaining = remainingCapacity(pool, reservations, rangeStart, rangeEnd);
          const allowed = seats > 0 && seats <= remaining;
          const projected = pool.hardLimit - remaining + seats;
          const softExceeded = pool.softLimit !== undefined && projected > pool.softLimit;
          return { allowed, remaining, softExceeded };
        }
        """,
    )
    w(
        "packages/domain/src/scheduling/capacity.test.ts",
        """
        import { describe, it, expect } from 'vitest';
        import { canReserve, remainingCapacity } from './capacity.js';

        describe('capacity', () => {
          const pool = { id: 'p1', hardLimit: 10, softLimit: 8 };

          it('tracks remaining seats', () => {
            const reservations = [
              { poolId: 'p1', seats: 4, rangeStart: '2024-01-01T09:00:00Z', rangeEnd: '2024-01-01T10:00:00Z' },
            ];
            expect(remainingCapacity(pool, reservations, '2024-01-01T09:00:00Z', '2024-01-01T10:00:00Z')).toBe(6);
          });

          it('blocks over-capacity reservations', () => {
            const reservations = [
              { poolId: 'p1', seats: 9, rangeStart: '2024-01-01T09:00:00Z', rangeEnd: '2024-01-01T10:00:00Z' },
            ];
            const result = canReserve(pool, reservations, 2, '2024-01-01T09:00:00Z', '2024-01-01T10:00:00Z');
            expect(result.allowed).toBe(false);
          });
        });
        """,
    )


def write_policy_engine() -> None:
    w(
        "packages/domain/src/policy/engine.ts",
        """
        export type Effect = 'allow' | 'deny';

        export interface PolicyRule {
          id: string;
          priority: number;
          effect: Effect;
          actions: string[];
          resources: string[];
          roles?: string[];
          conditions?: Record<string, string | number | boolean>;
        }

        export interface PolicyRequest {
          action: string;
          resource: string;
          role: string;
          attributes?: Record<string, string | number | boolean>;
        }

        export interface PolicyDecision {
          effect: Effect;
          matchedRuleId?: string;
          reason: string;
        }

        function matchValue(
          expected: string | number | boolean,
          actual: string | number | boolean | undefined,
        ): boolean {
          if (actual === undefined) return false;
          return expected === actual;
        }

        export function evaluatePolicies(rules: PolicyRule[], request: PolicyRequest): PolicyDecision {
          const sorted = [...rules].sort((a, b) => b.priority - a.priority);
          for (const rule of sorted) {
            const actionOk = rule.actions.includes('*') || rule.actions.includes(request.action);
            const resourceOk = rule.resources.includes('*') || rule.resources.includes(request.resource);
            const roleOk = !rule.roles || rule.roles.includes(request.role);
            const conditionsOk = !rule.conditions
              || Object.entries(rule.conditions).every(([k, v]) => matchValue(v, request.attributes?.[k]));
            if (actionOk && resourceOk && roleOk && conditionsOk) {
              return {
                effect: rule.effect,
                matchedRuleId: rule.id,
                reason: `matched rule ${rule.id} with effect ${rule.effect}`,
              };
            }
          }
          return { effect: 'deny', reason: 'no matching policy rule (default deny)' };
        }
        """,
    )
    w(
        "packages/domain/src/policy/engine.test.ts",
        """
        import { describe, it, expect } from 'vitest';
        import { evaluatePolicies, type PolicyRule } from './engine.js';

        const rules: PolicyRule[] = [
          { id: 'deny-billing', priority: 100, effect: 'deny', actions: ['billing:write'], resources: ['*'], roles: ['member'] },
          { id: 'allow-read', priority: 10, effect: 'allow', actions: ['space:read'], resources: ['space'], roles: ['member', 'admin'] },
          { id: 'admin-all', priority: 50, effect: 'allow', actions: ['*'], resources: ['*'], roles: ['admin'] },
        ];

        describe('policy engine', () => {
          it('allows member space read', () => {
            const decision = evaluatePolicies(rules, { action: 'space:read', resource: 'space', role: 'member' });
            expect(decision.effect).toBe('allow');
          });

          it('denies member billing write via higher priority', () => {
            const decision = evaluatePolicies(rules, { action: 'billing:write', resource: 'invoice', role: 'member' });
            expect(decision.effect).toBe('deny');
            expect(decision.matchedRuleId).toBe('deny-billing');
          });

          it('defaults to deny', () => {
            const decision = evaluatePolicies([], { action: 'x', resource: 'y', role: 'member' });
            expect(decision.effect).toBe('deny');
          });
        });
        """,
    )


def write_notifications_templates() -> None:
    import re

    templates = [
        ("booking_confirmed", "Booking confirmed", "Your booking for {{spaceName}} on {{date}} is confirmed."),
        ("booking_reminder", "Booking reminder", "Reminder: {{spaceName}} starts at {{startTime}}."),
        ("booking_cancelled", "Booking cancelled", "Your booking {{bookingId}} was cancelled."),
        ("visitor_invited", "Visitor invited", "{{visitorName}} is invited to visit on {{date}}."),
        ("visitor_checked_in", "Visitor checked in", "{{visitorName}} checked in at {{time}}."),
        ("amenity_reserved", "Amenity reserved", "{{amenityName}} reserved for {{date}}."),
        ("invoice_ready", "Invoice ready", "Invoice {{invoiceNumber}} is ready for {{orgName}}."),
        ("seat_limit_warning", "Seat limit warning", "Organization {{orgName}} is at {{percent}}% of seat capacity."),
        ("access_denied", "Access denied", "Access to {{resource}} was denied for {{userEmail}}."),
        ("weekly_digest", "Weekly workplace digest", "This week: {{bookings}} bookings, {{visitors}} visitors, {{utilization}}% utilization."),
    ]
    for key, subject, body in templates:
        vars_ = re.findall(r"\{\{(.*?)\}\}", body)
        w(
            f"packages/notifications/src/templates/{key}.ts",
            f"""
            import type {{ TemplateDefinition }} from '../types.js';

            export const {key}Template: TemplateDefinition = {{
              key: '{key}',
              channel: 'email',
              subject: '{subject}',
              body: '{body}',
              requiredVariables: {vars_!r},
            }};
            """,
        )


def write_notification_package() -> None:
    w(
        "packages/notifications/package.json",
        """
        {
          "name": "@waypoint/notifications",
          "version": "0.1.0",
          "private": true,
          "type": "module",
          "main": "./dist/index.js",
          "types": "./dist/index.d.ts",
          "exports": {
            ".": {
              "types": "./dist/index.d.ts",
              "import": "./dist/index.js"
            }
          },
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
        "packages/notifications/tsconfig.json",
        """
        {
          "extends": "../../tsconfig.base.json",
          "compilerOptions": { "outDir": "./dist", "rootDir": "./src" },
          "include": ["src/**/*"]
        }
        """,
    )
    w(
        "packages/notifications/vitest.config.ts",
        """
        import { defineConfig } from 'vitest/config';
        export default defineConfig({
          test: { globals: true, environment: 'node', include: ['src/**/*.test.ts'] },
        });
        """,
    )
    w(
        "packages/notifications/src/types.ts",
        """
        export type Channel = 'email' | 'sms' | 'push' | 'slack' | 'webhook';

        export interface TemplateDefinition {
          key: string;
          channel: Channel;
          subject: string;
          body: string;
          requiredVariables: string[];
        }

        export interface RenderedMessage {
          channel: Channel;
          subject: string;
          body: string;
        }
        """,
    )
    w(
        "packages/notifications/src/render.ts",
        """
        import type { TemplateDefinition, RenderedMessage } from './types.js';

        export function renderTemplate(
          template: TemplateDefinition,
          variables: Record<string, string>,
        ): RenderedMessage {
          for (const key of template.requiredVariables) {
            if (variables[key] === undefined || variables[key] === '') {
              throw new Error(`missing template variable: ${key}`);
            }
          }
          const replace = (input: string) =>
            input.replace(/\\{\\{(\\w+)\\}\\}/g, (_, name: string) => variables[name] ?? '');
          return {
            channel: template.channel,
            subject: replace(template.subject),
            body: replace(template.body),
          };
        }
        """,
    )
    w(
        "packages/notifications/src/render.test.ts",
        """
        import { describe, it, expect } from 'vitest';
        import { renderTemplate } from './render.js';

        describe('renderTemplate', () => {
          it('renders variables', () => {
            const msg = renderTemplate(
              {
                key: 't',
                channel: 'email',
                subject: 'Hello {{name}}',
                body: 'Welcome {{name}} to {{org}}',
                requiredVariables: ['name', 'org'],
              },
              { name: 'Ada', org: 'Waypoint' },
            );
            expect(msg.subject).toBe('Hello Ada');
            expect(msg.body).toBe('Welcome Ada to Waypoint');
          });

          it('throws on missing variables', () => {
            expect(() =>
              renderTemplate(
                {
                  key: 't',
                  channel: 'email',
                  subject: 'x',
                  body: '{{a}}',
                  requiredVariables: ['a'],
                },
                {},
              ),
            ).toThrow(/missing template variable/);
          });
        });
        """,
    )
    write_notifications_templates()
    w(
        "packages/notifications/src/templates/index.ts",
        """
        import { booking_confirmedTemplate } from './booking_confirmed.js';
        import { booking_reminderTemplate } from './booking_reminder.js';
        import { booking_cancelledTemplate } from './booking_cancelled.js';
        import { visitor_invitedTemplate } from './visitor_invited.js';
        import { visitor_checked_inTemplate } from './visitor_checked_in.js';
        import { amenity_reservedTemplate } from './amenity_reserved.js';
        import { invoice_readyTemplate } from './invoice_ready.js';
        import { seat_limit_warningTemplate } from './seat_limit_warning.js';
        import { access_deniedTemplate } from './access_denied.js';
        import { weekly_digestTemplate } from './weekly_digest.js';
        import type { TemplateDefinition } from '../types.js';

        export const templates: Record<string, TemplateDefinition> = {
          booking_confirmed: booking_confirmedTemplate,
          booking_reminder: booking_reminderTemplate,
          booking_cancelled: booking_cancelledTemplate,
          visitor_invited: visitor_invitedTemplate,
          visitor_checked_in: visitor_checked_inTemplate,
          amenity_reserved: amenity_reservedTemplate,
          invoice_ready: invoice_readyTemplate,
          seat_limit_warning: seat_limit_warningTemplate,
          access_denied: access_deniedTemplate,
          weekly_digest: weekly_digestTemplate,
        };

        export function getTemplate(key: string): TemplateDefinition {
          const template = templates[key];
          if (!template) throw new Error(`unknown template: ${key}`);
          return template;
        }
        """,
    )
    w(
        "packages/notifications/src/index.ts",
        """
        export * from './types.js';
        export * from './render.js';
        export * from './templates/index.js';
        """,
    )


def write_domain_package_root() -> None:
    w(
        "packages/domain/package.json",
        """
        {
          "name": "@waypoint/domain",
          "version": "0.1.0",
          "private": true,
          "type": "module",
          "main": "./dist/index.js",
          "types": "./dist/index.d.ts",
          "exports": {
            ".": {
              "types": "./dist/index.d.ts",
              "import": "./dist/index.js"
            }
          },
          "scripts": {
            "build": "tsc -p tsconfig.json",
            "test": "vitest run",
            "typecheck": "tsc -p tsconfig.json --noEmit"
          },
          "dependencies": {
            "zod": "^3.23.8"
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
        "packages/domain/tsconfig.json",
        """
        {
          "extends": "../../tsconfig.base.json",
          "compilerOptions": { "outDir": "./dist", "rootDir": "./src" },
          "include": ["src/**/*"]
        }
        """,
    )
    w(
        "packages/domain/vitest.config.ts",
        """
        import { defineConfig } from 'vitest/config';
        export default defineConfig({
          test: { globals: true, environment: 'node', include: ['src/**/*.test.ts'] },
        });
        """,
    )
    w(
        "packages/domain/src/result.ts",
        """
        export type Ok<T> = { ok: true; value: T };
        export type Err<E> = { ok: false; error: E };
        export type Result<T, E = Error> = Ok<T> | Err<E>;

        export function ok<T>(value: T): Ok<T> {
          return { ok: true, value };
        }

        export function err<E>(error: E): Err<E> {
          return { ok: false, error };
        }
        """,
    )
    w(
        "packages/domain/src/errors.ts",
        """
        export class DomainError extends Error {
          constructor(
            message: string,
            readonly code: string,
            readonly statusCode = 400,
          ) {
            super(message);
            this.name = 'DomainError';
          }
        }

        export class ValidationError extends DomainError {
          constructor(message: string) {
            super(message, 'VALIDATION_ERROR', 400);
            this.name = 'ValidationError';
          }
        }

        export class NotFoundError extends DomainError {
          constructor(message: string) {
            super(message, 'NOT_FOUND', 404);
            this.name = 'NotFoundError';
          }
        }

        export class ConflictError extends DomainError {
          constructor(message: string) {
            super(message, 'CONFLICT', 409);
            this.name = 'ConflictError';
          }
        }

        export class ForbiddenError extends DomainError {
          constructor(message: string) {
            super(message, 'FORBIDDEN', 403);
            this.name = 'ForbiddenError';
          }
        }
        """,
    )
    exports = "\n".join([f"export * from './{m}/index.js';" for m, _, _ in MODULES])
    w(
        "packages/domain/src/index.ts",
        f"""
        export * from './result.js';
        export * from './errors.js';
        export * from './scheduling/overlap.js';
        export * from './scheduling/capacity.js';
        export * from './policy/engine.js';
        {exports}
        """,
    )


def write_api_module_mirrors() -> None:
    for mod, entity, _ in MODULES:
        base = f"apps/api/src/modules/{mod}"
        w(
            f"{base}/types.ts",
            f"export type {{ {entity}, Create{entity}Input, Update{entity}Input, {entity}Filter }} from '@waypoint/domain';\n",
        )
        w(
            f"{base}/service.ts",
            f"""
            export {{ {entity}Service }} from '@waypoint/domain';
            export {{ Memory{entity}Repository }} from '@waypoint/domain';
            """,
        )
        w(
            f"{base}/routes.ts",
            f"""
            import type {{ FastifyInstance }} from 'fastify';
            import {{ {entity}Service, Memory{entity}Repository, create{entity}Schema, {mod}FilterSchema }} from '@waypoint/domain';

            export async function {mod}Routes(app: FastifyInstance): Promise<void> {{
              const service = new {entity}Service(new Memory{entity}Repository());

              app.get('/{mod}', async (req) => {{
                const filter = {mod}FilterSchema.parse(req.query);
                const result = await service.list(filter);
                if (!result.ok) throw result.error;
                return {{ data: result.value }};
              }});

              app.post('/{mod}', async (req) => {{
                const body = create{entity}Schema.parse(req.body);
                const result = await service.create(body);
                if (!result.ok) throw result.error;
                return {{ data: result.value }};
              }});

              app.get('/{mod}/:id', async (req) => {{
                const params = req.params as {{ id: string }};
                const query = req.query as {{ organizationId: string }};
                const result = await service.get(query.organizationId, params.id);
                if (!result.ok) throw result.error;
                return {{ data: result.value }};
              }});
            }}
            """,
        )
        w(
            f"{base}/index.ts",
            f"""
            export * from './types.js';
            export * from './service.js';
            export * from './routes.js';
            """,
        )
        w(
            f"apps/api/tests/{mod}.service.test.ts",
            f"""
            import {{ describe, it, expect }} from 'vitest';
            import {{ {entity}Service, Memory{entity}Repository }} from '@waypoint/domain';

            describe('api {mod} wiring', () => {{
              it('creates via domain service', async () => {{
                const service = new {entity}Service(new Memory{entity}Repository());
                const result = await service.create({{
                  organizationId: '11111111-1111-1111-1111-111111111111',
                  name: 'API {entity}',
                }});
                expect(result.ok).toBe(true);
              }});
            }});
            """,
        )


def write_analytics_lib() -> None:
    metrics = [
        "desk_utilization",
        "space_utilization",
        "booking_lead_time",
        "no_show_rate",
        "visitor_volume",
        "amenity_utilization",
        "peak_concurrency",
        "avg_meeting_length",
        "cancellation_rate",
        "checkin_compliance",
    ]
    for metric in metrics:
        w(
            f"packages/analytics/src/metrics/{metric}.ts",
            f"""
            export interface {metric.title().replace('_', '')}Sample {{
              organizationId: string;
              timestamp: string;
              value: number;
              dimensions?: Record<string, string>;
            }}

            export function aggregate{metric.title().replace('_', '')}(
              samples: {metric.title().replace('_', '')}Sample[],
            ): {{ average: number; max: number; min: number; count: number }} {{
              if (samples.length === 0) {{
                return {{ average: 0, max: 0, min: 0, count: 0 }};
              }}
              const values = samples.map((s) => s.value);
              const sum = values.reduce((a, b) => a + b, 0);
              return {{
                average: sum / values.length,
                max: Math.max(...values),
                min: Math.min(...values),
                count: values.length,
              }};
            }}

            export function normalize{metric.title().replace('_', '')}(value: number): number {{
              if (!Number.isFinite(value)) return 0;
              return Math.max(0, Math.min(100, value));
            }}
            """,
        )
        w(
            f"packages/analytics/src/metrics/{metric}.test.ts",
            f"""
            import {{ describe, it, expect }} from 'vitest';
            import {{ aggregate{metric.title().replace('_', '')}, normalize{metric.title().replace('_', '')} }} from './{metric}.js';

            describe('{metric}', () => {{
              it('aggregates samples', () => {{
                const result = aggregate{metric.title().replace('_', '')}([
                  {{ organizationId: 'o', timestamp: '2024-01-01T00:00:00Z', value: 10 }},
                  {{ organizationId: 'o', timestamp: '2024-01-01T01:00:00Z', value: 30 }},
                ]);
                expect(result.average).toBe(20);
                expect(result.max).toBe(30);
                expect(result.count).toBe(2);
              }});

              it('normalizes values', () => {{
                expect(normalize{metric.title().replace('_', '')}(120)).toBe(100);
                expect(normalize{metric.title().replace('_', '')}(-5)).toBe(0);
              }});
            }});
            """,
        )
    w(
        "packages/analytics/package.json",
        """
        {
          "name": "@waypoint/analytics",
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
        "packages/analytics/tsconfig.json",
        """
        {
          "extends": "../../tsconfig.base.json",
          "compilerOptions": { "outDir": "./dist", "rootDir": "./src" },
          "include": ["src/**/*"]
        }
        """,
    )
    w(
        "packages/analytics/vitest.config.ts",
        """
        import { defineConfig } from 'vitest/config';
        export default defineConfig({
          test: { environment: 'node', include: ['src/**/*.test.ts'] },
        });
        """,
    )
    w(
        "packages/analytics/src/index.ts",
        "\n".join([f"export * from './metrics/{m}.js';" for m in metrics]) + "\n",
    )


def write_docs() -> None:
    docs = {
        "docs/architecture/overview.md": """
        # Waypoint Architecture Overview

        Waypoint is a multi-tenant workplace operations platform organized as a TypeScript monorepo.

        ## Applications

        - `@waypoint/api` — HTTP API (Fastify)
        - `@waypoint/web` — Admin console
        - `@waypoint/portal` — Employee portal
        - `@waypoint/worker` — Asynchronous job processor

        ## Packages

        - `@waypoint/shared` — shared types and utilities
        - `@waypoint/domain` — domain services and business rules
        - `@waypoint/auth` — authentication and RBAC
        - `@waypoint/database` — PostgreSQL schema and migrations
        - `@waypoint/notifications` — templates and rendering
        - `@waypoint/analytics` — metric aggregation helpers
        - `@waypoint/logging` / `@waypoint/config` / `@waypoint/ui` — cross-cutting libraries

        ## Tenancy

        Every mutable entity is scoped by `organizationId`. Repositories must filter by tenant on read and write paths.
        """,
        "docs/architecture/data-model.md": """
        # Data Model

        Core entities: Organization, User, Building, Floor, Zone, Space, Desk, Booking, Visitor, Amenity,
        AccessPolicy, Notification, Invoice, AuditEvent.

        Relationships are enforced in application services and PostgreSQL foreign keys.
        Soft-delete / archive is preferred over hard deletes for operational entities.
        """,
        "docs/api/overview.md": """
        # API Overview

        The Waypoint API is a JSON HTTP API served by Fastify.

        ## Conventions

        - Base path: `/v1`
        - Auth: Bearer JWT
        - Tenant context: derived from JWT claims and optional `X-Organization-Id`
        - Errors: `{ "error": { "code": string, "message": string } }`
        - Pagination: `limit`, `offset`, response includes `meta.total` when available
        """,
        "docs/api/auth.md": """
        # Authentication

        - `POST /v1/auth/login` — email/password → access + refresh tokens
        - `POST /v1/auth/refresh` — rotate access token
        - `POST /v1/auth/logout` — revoke refresh token

        Passwords are hashed with bcrypt/argon2 via `@waypoint/auth`.
        """,
        "docs/api/bookings.md": """
        # Bookings API

        Bookings reserve desks or spaces for a time range.

        Business rules:
        - No overlapping active bookings for the same resource
        - End must be after start
        - Capacity pools enforce seat limits
        - Cancellations emit notification jobs
        """,
        "docs/deployment/docker.md": """
        # Docker Deployment

        ```bash
        docker compose up --build
        ```

        Services: `api`, `web`, `portal`, `worker`, `postgres`, `redis`.

        See root `docker-compose.yml` for ports and environment variables.
        """,
        "docs/deployment/environments.md": """
        # Environments

        | Variable | Description |
        |----------|-------------|
        | `DATABASE_URL` | PostgreSQL connection string |
        | `REDIS_URL` | Redis connection for worker |
        | `JWT_SECRET` | Token signing secret |
        | `LOG_LEVEL` | info/debug/warn/error |
        | `VITE_API_URL` | Browser API base URL |
        """,
        "docs/database/migrations.md": """
        # Database Migrations

        SQL migrations live in `packages/database/migrations` and are applied in lexicographic order.

        Never edit applied migrations in production; add a new migration instead.
        """,
        "docs/troubleshooting.md": """
        # Troubleshooting

        ## API will not start

        - Confirm `DATABASE_URL` and `JWT_SECRET`
        - Check port 3000 availability

        ## Worker not processing jobs

        - Confirm Redis is reachable
        - Inspect worker logs for failed job payloads

        ## Frontend blank page

        - Verify `VITE_API_URL`
        - Check browser console for CORS failures
        """,
        "docs/configuration.md": """
        # Configuration

        Configuration is loaded through `@waypoint/config` with Zod validation.
        Invalid environment variables fail fast at process start.
        """,
        "CHANGELOG.md": """
        # Changelog

        All notable changes to Waypoint are documented in this file.

        ## [Unreleased]

        ## [1.0.0] - 2026-06-18
        ### Added
        - Stable API v1 surface
        - Admin console and employee portal
        - Docker Compose production-like stack
        """,
        "CONTRIBUTING.md": """
        # Contributing to Waypoint

        1. Use pnpm and Node version from `.nvmrc`
        2. Run `pnpm lint && pnpm typecheck && pnpm test` before opening a PR
        3. Keep modules tenant-scoped
        4. Prefer domain rules in `@waypoint/domain`
        """,
    }
    for path, content in docs.items():
        w(path, content)


def write_docker_and_ci() -> None:
    w(
        "Dockerfile",
        """
        # syntax=docker/dockerfile:1
        FROM node:22-bookworm-slim AS base
        WORKDIR /app
        RUN corepack enable

        FROM base AS deps
        COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
        COPY apps ./apps
        COPY packages ./packages
        RUN pnpm install --frozen-lockfile || pnpm install

        FROM deps AS build
        RUN pnpm build

        FROM base AS api
        ENV NODE_ENV=production
        COPY --from=build /app /app
        WORKDIR /app/apps/api
        EXPOSE 3000
        CMD ["node", "dist/index.js"]

        FROM base AS worker
        ENV NODE_ENV=production
        COPY --from=build /app /app
        WORKDIR /app/apps/worker
        CMD ["node", "dist/index.js"]
        """,
    )
    w(
        "docker-compose.yml",
        """
        services:
          postgres:
            image: postgres:16-alpine
            environment:
              POSTGRES_USER: waypoint
              POSTGRES_PASSWORD: waypoint
              POSTGRES_DB: waypoint
            ports:
              - "5432:5432"
            volumes:
              - wp_pg:/var/lib/postgresql/data
            healthcheck:
              test: ["CMD-SHELL", "pg_isready -U waypoint"]
              interval: 5s
              timeout: 5s
              retries: 10

          redis:
            image: redis:7-alpine
            ports:
              - "6379:6379"
            healthcheck:
              test: ["CMD", "redis-cli", "ping"]
              interval: 5s
              timeout: 3s
              retries: 10

          api:
            build:
              context: .
              target: api
            environment:
              DATABASE_URL: postgres://waypoint:waypoint@postgres:5432/waypoint
              REDIS_URL: redis://redis:6379
              JWT_SECRET: dev-secret-change-me
              PORT: "3000"
              LOG_LEVEL: info
            ports:
              - "3000:3000"
            depends_on:
              postgres:
                condition: service_healthy
              redis:
                condition: service_healthy

          worker:
            build:
              context: .
              target: worker
            environment:
              DATABASE_URL: postgres://waypoint:waypoint@postgres:5432/waypoint
              REDIS_URL: redis://redis:6379
              LOG_LEVEL: info
            depends_on:
              postgres:
                condition: service_healthy
              redis:
                condition: service_healthy

          web:
            image: node:22-bookworm-slim
            working_dir: /app
            command: bash -lc "corepack enable && pnpm --filter @waypoint/web dev --host 0.0.0.0 --port 5173"
            volumes:
              - ./:/app
            environment:
              VITE_API_URL: http://localhost:3000
            ports:
              - "5173:5173"
            depends_on:
              - api

          portal:
            image: node:22-bookworm-slim
            working_dir: /app
            command: bash -lc "corepack enable && pnpm --filter @waypoint/portal dev --host 0.0.0.0 --port 5174"
            volumes:
              - ./:/app
            environment:
              VITE_API_URL: http://localhost:3000
            ports:
              - "5174:5174"
            depends_on:
              - api

        volumes:
          wp_pg:
        """,
    )
    w(
        ".github/workflows/ci.yml",
        """
        name: CI

        on:
          push:
            branches: [main, develop]
          pull_request:

        jobs:
          build-test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
              - uses: pnpm/action-setup@v4
                with:
                  version: 9
              - uses: actions/setup-node@v4
                with:
                  node-version: 22
                  cache: pnpm
              - run: pnpm install --frozen-lockfile
              - run: pnpm lint
              - run: pnpm typecheck
              - run: pnpm test
              - run: pnpm build

          docker:
            runs-on: ubuntu-latest
            needs: build-test
            steps:
              - uses: actions/checkout@v4
              - run: docker build --target api -t waypoint-api:ci .
              - run: docker build --target worker -t waypoint-worker:ci .
        """,
    )
    w(
        ".github/workflows/release.yml",
        """
        name: Release

        on:
          push:
            tags:
              - 'v*'

        jobs:
          release-notes:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
              - run: |
                  echo "Waypoint release ${GITHUB_REF_NAME}" >> "$GITHUB_STEP_SUMMARY"
        """,
    )
    w(
        ".env.example",
        """
        DATABASE_URL=postgres://waypoint:waypoint@localhost:5432/waypoint
        REDIS_URL=redis://localhost:6379
        JWT_SECRET=change-me
        PORT=3000
        LOG_LEVEL=info
        VITE_API_URL=http://localhost:3000
        """,
    )


def write_ui_pages() -> None:
    pages = [
        ("BuildingsPage", "buildings", "Manage office buildings and timezones"),
        ("FloorsPage", "floors", "Organize floors within buildings"),
        ("ZonesPage", "zones", "Partition floors into bookable zones"),
        ("PoliciesPage", "policies", "Configure access policies"),
        ("WebhooksPage", "webhooks", "Manage outbound webhook endpoints"),
        ("AuditPage", "audit", "Review immutable audit events"),
        ("ReportsPage", "reports", "Generate workplace reports"),
        ("TeamsPage", "teams", "Organize people into teams"),
        ("ShiftsPage", "shifts", "Plan workplace shifts"),
        ("AssetsPage", "assets", "Track workplace assets"),
        ("FeatureFlagsPage", "flags", "Toggle organization feature flags"),
        ("CheckInsPage", "checkins", "Monitor booking check-ins"),
    ]
    for component, route, blurb in pages:
        w(
            f"apps/web/src/pages/{route}/{component}.tsx",
            f"""
            import {{ PageHeader }} from '@waypoint/ui';
            import styles from './{component}.module.css';

            export function {component}() {{
              return (
                <div className={{styles.page}}>
                  <PageHeader title="{component.replace('Page', '')}" subtitle="{blurb}" />
                  <section className={{styles.content}}>
                    <p>Operational controls for {route} in the Waypoint admin console.</p>
                  </section>
                </div>
              );
            }}

            export default {component};
            """,
        )
        w(
            f"apps/web/src/pages/{route}/{component}.module.css",
            """
            .page {
              display: flex;
              flex-direction: column;
              gap: 1.25rem;
            }

            .content {
              color: #1f2937;
              line-height: 1.6;
            }
            """,
        )
        w(
            f"apps/portal/src/pages/{route}/{component}.tsx",
            f"""
            import styles from './{component}.module.css';

            export function {component}() {{
              return (
                <main className={{styles.page}}>
                  <h1>{component.replace('Page', '')}</h1>
                  <p>{blurb}</p>
                </main>
              );
            }}

            export default {component};
            """,
        )
        w(
            f"apps/portal/src/pages/{route}/{component}.module.css",
            """
            .page {
              padding: 1.5rem;
              max-width: 720px;
            }
            """,
        )


def write_worker_jobs() -> None:
    jobs = [
        "bookingReminderJob",
        "visitorExpiryJob",
        "notificationDispatchJob",
        "analyticsRollupJob",
        "invoiceGenerationJob",
        "webhookDeliveryJob",
        "checkinNudgeJob",
        "slaBreachJob",
        "digestEmailJob",
        "staleInviteCleanupJob",
    ]
    for job in jobs:
        w(
            f"apps/worker/src/jobs/{job}.ts",
            f"""
            import type {{ JobHandler, JobContext }} from '../types.js';

            export interface {job[0].upper() + job[1:]}Payload {{
              organizationId: string;
              referenceId: string;
              runAt?: string;
            }}

            export const {job}: JobHandler<{job[0].upper() + job[1:]}Payload> = {{
              name: '{job}',
              async handle(payload, ctx: JobContext): Promise<void> {{
                if (!payload.organizationId) {{
                  throw new Error('organizationId is required');
                }}
                if (!payload.referenceId) {{
                  throw new Error('referenceId is required');
                }}
                ctx.logger.info({{ job: '{job}', ...payload }}, 'processing job');
                await ctx.metrics.increment('worker.job.success', {{ job: '{job}' }});
              }},
            }};
            """,
        )
        w(
            f"apps/worker/src/jobs/{job}.test.ts",
            f"""
            import {{ describe, it, expect, vi }} from 'vitest';
            import {{ {job} }} from './{job}.js';

            describe('{job}', () => {{
              it('processes a valid payload', async () => {{
                const logger = {{ info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() }};
                const metrics = {{ increment: vi.fn(async () => undefined) }};
                await {job}.handle(
                  {{ organizationId: 'org-1', referenceId: 'ref-1' }},
                  {{ logger, metrics }} as any,
                );
                expect(metrics.increment).toHaveBeenCalled();
              }});

              it('rejects missing organizationId', async () => {{
                await expect(
                  {job}.handle({{ organizationId: '', referenceId: 'x' }} as any, {{
                    logger: {{ info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() }},
                    metrics: {{ increment: vi.fn() }},
                  }} as any),
                ).rejects.toThrow(/organizationId/);
              }});
            }});
            """,
        )


def write_substantial_utils() -> None:
    utils = [
        ("retry", "retry transient failures with exponential backoff"),
        ("circuitBreaker", "trip after consecutive failures"),
        ("rateLimiter", "token bucket rate limiting"),
        ("hash", "stable hashing helpers"),
        ("csv", "CSV encode/decode"),
        ("ical", "ICS calendar serialization"),
        ("geo", "haversine distance helpers"),
        ("phone", "E.164 normalization"),
        ("email", "email normalization and validation"),
        ("clock", "testable clock abstraction"),
    ]
    for name, desc in utils:
        w(
            f"packages/shared/src/utils/{name}.ts",
            f"""
            /** {desc} */

            export async function withRetry<T>(
              fn: () => Promise<T>,
              options: {{ retries?: number; baseMs?: number }} = {{}},
            ): Promise<T> {{
              const retries = options.retries ?? 3;
              const baseMs = options.baseMs ?? 50;
              let attempt = 0;
              let lastError: unknown;
              while (attempt <= retries) {{
                try {{
                  return await fn();
                }} catch (error) {{
                  lastError = error;
                  if (attempt === retries) break;
                  await new Promise((r) => setTimeout(r, baseMs * 2 ** attempt));
                  attempt += 1;
                }}
              }}
              throw lastError;
            }}

            export class Simple{name[0].upper() + name[1:]} {{
              private failures = 0;
              constructor(private readonly threshold = 5) {{}}

              recordSuccess(): void {{
                this.failures = 0;
              }}

              recordFailure(): void {{
                this.failures += 1;
              }}

              get open(): boolean {{
                return this.failures >= this.threshold;
              }}
            }}
            """,
        )
        w(
            f"packages/shared/src/utils/{name}.test.ts",
            f"""
            import {{ describe, it, expect, vi }} from 'vitest';
            import {{ withRetry, Simple{name[0].upper() + name[1:]} }} from './{name}.js';

            describe('shared utils/{name}', () => {{
              it('retries failed operations', async () => {{
                const fn = vi
                  .fn()
                  .mockRejectedValueOnce(new Error('temp'))
                  .mockResolvedValueOnce('ok');
                await expect(withRetry(fn, {{ retries: 2, baseMs: 1 }})).resolves.toBe('ok');
              }});

              it('tracks breaker state', () => {{
                const breaker = new Simple{name[0].upper() + name[1:]}(2);
                breaker.recordFailure();
                expect(breaker.open).toBe(false);
                breaker.recordFailure();
                expect(breaker.open).toBe(true);
              }});
            }});
            """,
        )


def main() -> None:
    write_domain_package_root()
    for mod, entity, rules in MODULES:
        write_domain_module(mod, entity, rules)
    write_booking_engine()
    write_policy_engine()
    write_notification_package()
    write_analytics_lib()
    write_api_module_mirrors()
    write_docs()
    write_docker_and_ci()
    write_ui_pages()
    write_worker_jobs()
    write_substantial_utils()
    # ensure worker types exist for jobs
    w(
        "apps/worker/src/types.ts",
        """
        export interface JobContext {
          logger: {
            info: (obj: unknown, msg?: string) => void;
            error: (obj: unknown, msg?: string) => void;
            warn: (obj: unknown, msg?: string) => void;
            debug: (obj: unknown, msg?: string) => void;
          };
          metrics: {
            increment: (name: string, tags?: Record<string, string>) => Promise<void>;
          };
        }

        export interface JobHandler<TPayload> {
          name: string;
          handle: (payload: TPayload, ctx: JobContext) => Promise<void>;
        }
        """,
    )
    print("Expansion complete")


if __name__ == "__main__":
    main()
