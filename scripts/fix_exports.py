#!/usr/bin/env python3
"""Point workspace package exports at TypeScript source for local test/dev."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

for pkg_json in ROOT.glob("packages/*/package.json"):
    data = json.loads(pkg_json.read_text(encoding="utf-8"))
    src_index = pkg_json.parent / "src" / "index.ts"
    if not src_index.exists():
        # create a minimal index if missing but src exists
        src_dir = pkg_json.parent / "src"
        if src_dir.exists():
            files = sorted(src_dir.rglob("*.ts"))
            exports = [
                f"export * from './{f.relative_to(src_dir).as_posix()[:-3]}.js';"
                for f in files
                if not f.name.endswith(".test.ts") and f.name != "index.ts"
            ][:20]
            if exports:
                src_index.write_text("\n".join(exports) + "\n", encoding="utf-8")
    if src_index.exists():
        data["main"] = "./src/index.ts"
        data["types"] = "./src/index.ts"
        data["exports"] = {
            ".": {
                "types": "./src/index.ts",
                "import": "./src/index.ts",
                "default": "./src/index.ts",
            }
        }
        pkg_json.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
        print("updated", pkg_json.parent.name)

print("done")
