#!/usr/bin/env python3
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
from expand_engines import make_engine, w, ROOT

extra = [
    ("SpacePlanningEngine", "SpacePlan", "packages/domain/src/orchestration/spacePlanningEngine.ts"),
    ("DeskAssignmentEngine", "DeskAssign", "packages/domain/src/orchestration/deskAssignmentEngine.ts"),
    ("AuditPipelineEngine", "AuditPipe", "packages/domain/src/orchestration/auditPipelineEngine.ts"),
    ("ReportPipelineEngine", "ReportPipe", "packages/analytics/src/reports/reportPipelineEngine.ts"),
    ("ConfigGuardEngine", "CfgGuard", "packages/config/src/guard/configGuardEngine.ts"),
    ("AuthPolicyEngine", "AuthPol", "packages/auth/src/policy/authPolicyEngine.ts"),
]

for cls, prefix, path in extra:
    w(path, make_engine(cls, prefix, 40))
    stem = Path(path).stem
    w(
        path.replace(".ts", ".test.ts"),
        f"""
        import {{ describe, it, expect }} from 'vitest';
        import {{ {cls} }} from './{stem}.js';

        describe('{cls}', () => {{
          it('runs', () => {{
            const e = new {cls}();
            const r = e.runAll({{ organizationId: 'o', actorId: 'a', resourceId: 'r', action: 'read' }});
            expect(r).toHaveLength(40);
          }});
        }});
        """,
    )

domain_index = ROOT / "packages/domain/src/index.ts"
if domain_index.exists():
    text = domain_index.read_text(encoding="utf-8")
    for line in [
        "export * from './orchestration/spacePlanningEngine.js';",
        "export * from './orchestration/deskAssignmentEngine.js';",
        "export * from './orchestration/auditPipelineEngine.js';",
    ]:
        if line not in text:
            text = text.rstrip() + "\n" + line + "\n"
    domain_index.write_text(text, encoding="utf-8")

print("expand_engines2 complete")
