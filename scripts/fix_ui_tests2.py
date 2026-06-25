#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
names = [
    "Avatar",
    "Badge",
    "Card",
    "EmptyState",
    "FormField",
    "Input",
    "PageHeader",
    "Select",
    "Spinner",
    "Tabs",
]
for name in names:
    path = ROOT / f"packages/ui/src/components/{name}/{name}.test.tsx"
    path.write_text(
        f"""import {{ describe, it, expect }} from 'vitest';
import {{ {name} }} from './{name}';

describe('{name}', () => {{
  it('is a function component', () => {{
    expect(typeof {name}).toBe('function');
  }});
}});
""",
        encoding="utf-8",
    )
    print("wrote", path.name)
print("done")
