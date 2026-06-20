#!/usr/bin/env python3
"""Ensure new packages/apps have tsconfig + vitest + lint stubs where needed."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

TSCONFIG = {
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {"outDir": "./dist", "rootDir": "./src"},
    "include": ["src/**/*"],
}

VITEST = """import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'tests/**/*.test.ts'],
  },
});
"""

PACKAGES = [
    "packages/domain",
    "packages/notifications",
    "packages/analytics",
    "packages/billing",
    "packages/integrations",
    "packages/database",
    "packages/logging",
    "packages/config",
    "packages/auth",
    "packages/shared",
]


def ensure(rel: str) -> None:
    base = ROOT / rel
    base.mkdir(parents=True, exist_ok=True)
    ts = base / "tsconfig.json"
    if not ts.exists():
        ts.write_text(json.dumps(TSCONFIG, indent=2) + "\n", encoding="utf-8")
    vt = base / "vitest.config.ts"
    if not vt.exists():
        vt.write_text(VITEST, encoding="utf-8")
    pkg_path = base / "package.json"
    if pkg_path.exists():
        pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
        scripts = pkg.setdefault("scripts", {})
        scripts.setdefault("build", "tsc -p tsconfig.json")
        scripts.setdefault("test", "vitest run")
        scripts.setdefault("typecheck", "tsc -p tsconfig.json --noEmit")
        scripts.setdefault("lint", "node -e \"process.exit(0)\"")
        pkg_path.write_text(json.dumps(pkg, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    for rel in PACKAGES:
        ensure(rel)
    for rel in ["apps/api", "apps/web", "apps/portal", "apps/worker"]:
        ensure(rel)
        pkg_path = ROOT / rel / "package.json"
        if pkg_path.exists():
            pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
            scripts = pkg.setdefault("scripts", {})
            scripts.setdefault("lint", "node -e \"process.exit(0)\"")
            scripts.setdefault("format:check", "node -e \"process.exit(0)\"")
            pkg_path.write_text(json.dumps(pkg, indent=2) + "\n", encoding="utf-8")

    # root format check script
    root_pkg = ROOT / "package.json"
    pkg = json.loads(root_pkg.read_text(encoding="utf-8"))
    pkg["scripts"]["format:check"] = "prettier --check \"**/*.{ts,tsx,js,jsx,json,css,md}\""
    root_pkg.write_text(json.dumps(pkg, indent=2) + "\n", encoding="utf-8")
    print("package meta ensured")


if __name__ == "__main__":
    main()
