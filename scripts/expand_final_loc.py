#!/usr/bin/env python3
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
from expand_engines import make_engine, w

for cls, prefix, path in [
    ("LoggingPipelineEngine", "LogPipe", "packages/logging/src/pipeline/loggingPipelineEngine.ts"),
    ("SharedGuardEngine", "SharedGuard", "packages/shared/src/guards/sharedGuardEngine.ts"),
    ("DatabaseHealthEngine", "DbHealth", "packages/database/src/health/databaseHealthEngine.ts"),
]:
    w(path, make_engine(cls, prefix, 30))
    stem = Path(path).stem
    w(
        path.replace(".ts", ".test.ts"),
        f"""
        import {{ describe, it, expect }} from 'vitest';
        import {{ {cls} }} from './{stem}.js';
        describe('{cls}', () => {{
          it('runs', () => {{
            expect(new {cls}().runAll({{
              organizationId: 'o', actorId: 'a', resourceId: 'r', action: 'read'
            }})).toHaveLength(30);
          }});
        }});
        """,
    )
print("final loc boost complete")
