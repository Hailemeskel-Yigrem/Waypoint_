#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
from textwrap import dedent

ROOT = Path(__file__).resolve().parents[1]


def w(rel: str, content: str) -> None:
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(dedent(content).lstrip("\n"), encoding="utf-8")


def make_engine(class_name: str, prefix: str, n: int = 35) -> str:
    methods = []
    calls = []
    for i in range(1, n + 1):
        methods.append(
            f"""
  process{prefix}{i}(input: {class_name}Input): {class_name}Result {{
    const issues: string[] = [];
    if (!input.organizationId) issues.push('organizationId');
    if (!input.actorId) issues.push('actorId');
    if (!input.resourceId) issues.push('resourceId');
    if (input.quantity !== undefined && input.quantity < 1) issues.push('quantity');
    if (input.start && input.end && Date.parse(input.end) <= Date.parse(input.start)) issues.push('range');
    if (input.tags && input.tags.length > 20) issues.push('too many tags');
    if (input.metadata && Object.keys(input.metadata).length > 50) issues.push('metadata too large');
    if (input.flags?.maintenance && input.action === 'write') issues.push('maintenance blocks write');
    if (input.flags?.readonly && input.action !== 'read') issues.push('readonly mode');
    if ((input.priority ?? 0) > 10) issues.push('priority out of range');
    if (input.channel && !['email', 'sms', 'push', 'slack'].includes(input.channel)) issues.push('bad channel');
    return {{
      ok: issues.length === 0,
      code: issues.length ? '{prefix}_{i}_FAIL' : '{prefix}_{i}_OK',
      issues,
      score: Math.max(0, 100 - issues.length * 10 - {i % 7}),
    }};
  }}"""
        )
        calls.append(f"      this.process{prefix}{i}(input),")
    return f"""
export interface {class_name}Input {{
  organizationId: string;
  actorId: string;
  resourceId: string;
  action: 'read' | 'write' | 'delete';
  start?: string;
  end?: string;
  quantity?: number;
  priority?: number;
  channel?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  flags?: {{ maintenance?: boolean; readonly?: boolean }};
}}

export interface {class_name}Result {{
  ok: boolean;
  code: string;
  issues: string[];
  score: number;
}}

export class {class_name} {{
{''.join(methods)}

  runAll(input: {class_name}Input): {class_name}Result[] {{
    return [
{chr(10).join(calls)}
    ];
  }}

  summarize(results: {class_name}Result[]): {{ passed: number; failed: number; avgScore: number }} {{
    const passed = results.filter((r) => r.ok).length;
    const failed = results.length - passed;
    const avgScore = results.reduce((a, b) => a + b.score, 0) / (results.length || 1);
    return {{ passed, failed, avgScore }};
  }}
}}
"""


def main() -> None:
    engines = [
        ("VisitorFlowEngine", "Visitor", "packages/domain/src/orchestration/visitorFlowEngine.ts"),
        ("AmenityFlowEngine", "Amenity", "packages/domain/src/orchestration/amenityFlowEngine.ts"),
        ("NotificationFlowEngine", "Notify", "packages/notifications/src/flow/notificationFlowEngine.ts"),
        ("WorkerDispatchEngine", "Dispatch", "apps/worker/src/engines/workerDispatchEngine.ts"),
        ("PortalBookingEngine", "PortalBook", "apps/portal/src/lib/portalBookingEngine.ts"),
        ("WebAdminEngine", "Admin", "apps/web/src/lib/webAdminEngine.ts"),
        ("IntegrationFlowEngine", "Integrate", "packages/integrations/src/flow/integrationFlowEngine.ts"),
        ("BillingFlowEngine", "Bill", "packages/billing/src/flow/billingFlowEngine.ts"),
    ]
    for cls, prefix, path in engines:
        w(path, make_engine(cls, prefix, 35))
        stem = Path(path).stem
        w(
            path.replace(".ts", ".test.ts"),
            f"""
            import {{ describe, it, expect }} from 'vitest';
            import {{ {cls} }} from './{stem}.js';

            describe('{cls}', () => {{
              it('passes a clean write', () => {{
                const engine = new {cls}();
                const results = engine.runAll({{
                  organizationId: 'org',
                  actorId: 'user',
                  resourceId: 'res',
                  action: 'write',
                  start: '2024-01-01T10:00:00Z',
                  end: '2024-01-01T11:00:00Z',
                  quantity: 1,
                  priority: 1,
                  channel: 'email',
                }});
                const summary = engine.summarize(results);
                expect(summary.passed).toBeGreaterThan(0);
                expect(results).toHaveLength(35);
              }});
            }});
            """,
        )

    domain_index = ROOT / "packages/domain/src/index.ts"
    if domain_index.exists():
        text = domain_index.read_text(encoding="utf-8")
        for line in [
            "export * from './orchestration/visitorFlowEngine.js';",
            "export * from './orchestration/amenityFlowEngine.js';",
        ]:
            if line not in text:
                text = text.rstrip() + "\n" + line + "\n"
        domain_index.write_text(text, encoding="utf-8")

    print("expand_engines complete")


if __name__ == "__main__":
    main()
