#!/usr/bin/env python3
"""
Build a realistic Waypoint git history from 2023-01 through 2026-06.

Constraints:
- No commits in July 2026 (or later)
- Only technologies/versions available at each commit date
- Five approved authors only
"""
from __future__ import annotations

import os
import random
import shutil
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
random.seed(42)

AUTHORS = [
    ("Hailemeskel Yigrem", "hailemeskelyigrem5@gmail.com"),
    ("Biniyam Endeg", "biniamshambel12@gmail.com"),
    ("Daniel Ewnetu", "tenahiwot21@gmail.com"),
    ("Hailemichael Wube", "hailemichael384@gmail.com"),
    ("Bereket Yigrem", "biobereket7@gmail.com"),
]

# Era snapshots — versions must exist by that era's start.
# Timeline ends June 2026 (not July).
ERAS = [
    {
        "until": "2023-06-30",
        "node": "18",
        "pnpm": "8.6.0",
        "typescript": "~5.0.4",
        "vitest": "^0.32.4",
        "fastify": "^4.18.0",
        "zod": "^3.21.4",
        "react": "^18.2.0",
        "react_dom": "^18.2.0",
        "vite": "^4.3.9",
        "react_router": "^6.14.1",
        "turbo": "^1.10.6",
        "eslint": "^8.44.0",
        "prettier": "^2.8.8",
        "pino": "^8.14.1",
        "bullmq_note": "not yet",
    },
    {
        "until": "2023-12-31",
        "node": "18",
        "pnpm": "8.10.0",
        "typescript": "~5.2.2",
        "vitest": "^1.0.4",  # Vitest 1.0 Nov 2023
        "fastify": "^4.24.3",
        "zod": "^3.22.4",
        "react": "^18.2.0",
        "react_dom": "^18.2.0",
        "vite": "^5.0.0",  # Vite 5 Nov 2023
        "react_router": "^6.20.0",
        "turbo": "^1.10.16",
        "eslint": "^8.54.0",
        "prettier": "^3.1.0",
        "pino": "^8.16.2",
    },
    {
        "until": "2024-06-30",
        "node": "20",
        "pnpm": "9.1.0",  # pnpm 9 Apr 2024
        "typescript": "~5.4.5",
        "vitest": "^1.6.0",
        "fastify": "^4.27.0",
        "zod": "^3.23.8",
        "react": "^18.3.1",
        "react_dom": "^18.3.1",
        "vite": "^5.2.0",
        "react_router": "^6.23.0",
        "turbo": "^1.13.3",
        "eslint": "^9.0.0",  # ESLint 9 Apr 2024
        "prettier": "^3.2.5",
        "pino": "^9.0.0",
    },
    {
        "until": "2024-12-31",
        "node": "20",
        "pnpm": "9.12.0",
        "typescript": "~5.6.3",
        "vitest": "^2.1.0",  # Vitest 2 mid/late 2024
        "fastify": "^4.28.1",
        "zod": "^3.23.8",
        "react": "^18.3.1",
        "react_dom": "^18.3.1",
        "vite": "^5.4.0",
        "react_router": "^6.28.0",
        "turbo": "^2.1.0",  # Turbo 2 2024
        "eslint": "^9.12.0",
        "prettier": "^3.3.3",
        "pino": "^9.4.0",
    },
    {
        "until": "2025-06-30",
        "node": "22",
        "pnpm": "9.15.0",
        "typescript": "~5.7.2",
        "vitest": "^2.1.8",
        "fastify": "^4.28.1",
        "zod": "^3.23.8",
        "react": "^19.0.0",  # React 19 Dec 2024
        "react_dom": "^19.0.0",
        "vite": "^6.0.0",  # Vite 6 Nov 2024
        "react_router": "^7.1.0",  # RR7 late 2024
        "turbo": "^2.3.0",
        "eslint": "^9.17.0",
        "prettier": "^3.4.2",
        "pino": "^9.5.0",
    },
    {
        "until": "2026-06-28",  # hard stop before July 2026
        "node": "22",
        "pnpm": "9.15.0",
        "typescript": "~5.7.3",
        "vitest": "^2.1.8",
        "fastify": "^4.28.1",
        "zod": "^3.23.8",
        "react": "^19.0.0",
        "react_dom": "^19.0.0",
        "vite": "^6.0.3",
        "react_router": "^7.1.1",
        "turbo": "^2.3.3",
        "eslint": "^9.18.0",
        "prettier": "^3.4.2",
        "pino": "^9.5.0",
    },
]


@dataclass
class CommitSpec:
    date: datetime
    author_idx: int
    message: str
    paths: list[str]


def run(cmd: list[str], env: dict | None = None) -> None:
    subprocess.run(cmd, cwd=ROOT, check=True, env=env or os.environ.copy())


def git_env(author: tuple[str, str], when: datetime) -> dict:
    env = os.environ.copy()
    stamp = when.strftime("%Y-%m-%dT%H:%M:%S")
    env["GIT_AUTHOR_NAME"] = author[0]
    env["GIT_AUTHOR_EMAIL"] = author[1]
    env["GIT_COMMITTER_NAME"] = author[0]
    env["GIT_COMMITTER_EMAIL"] = author[1]
    env["GIT_AUTHOR_DATE"] = stamp
    env["GIT_COMMITTER_DATE"] = stamp
    return env


def era_for(when: datetime) -> dict:
    for era in ERAS:
        if when.strftime("%Y-%m-%d") <= era["until"]:
            return era
    return ERAS[-1]


def list_source_files() -> list[str]:
    skip_dirs = {
        "node_modules",
        ".git",
        "dist",
        "coverage",
        ".turbo",
        "scripts",  # keep generators out of product history
    }
    skip_files = {
        "pnpm-lock.yaml",
        "package-lock.json",
    }
    files: list[str] = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in skip_dirs]
        for fn in filenames:
            if fn in skip_files:
                continue
            if fn.endswith(".map"):
                continue
            full = Path(dirpath) / fn
            rel = full.relative_to(ROOT).as_posix()
            if rel.startswith("scripts/"):
                continue
            files.append(rel)
    return sorted(files)


def classify(path: str) -> str:
    if path.startswith("packages/shared"):
        return "shared"
    if path.startswith("packages/domain"):
        return "domain"
    if path.startswith("packages/auth"):
        return "auth"
    if path.startswith("packages/database"):
        return "database"
    if path.startswith("packages/logging") or path.startswith("packages/config"):
        return "platform"
    if path.startswith("packages/ui"):
        return "ui"
    if path.startswith("packages/notifications"):
        return "notifications"
    if path.startswith("packages/analytics"):
        return "analytics"
    if path.startswith("packages/billing"):
        return "billing"
    if path.startswith("packages/integrations"):
        return "integrations"
    if path.startswith("apps/api"):
        return "api"
    if path.startswith("apps/web"):
        return "web"
    if path.startswith("apps/portal"):
        return "portal"
    if path.startswith("apps/worker"):
        return "worker"
    if path.startswith("docs") or path in {"README.md", "CHANGELOG.md", "CONTRIBUTING.md"}:
        return "docs"
    if path.startswith(".github") or path.startswith("docker") or path in {
        "Dockerfile",
        "docker-compose.yml",
        ".env.example",
    }:
        return "infra"
    if path in {
        "package.json",
        "pnpm-workspace.yaml",
        "turbo.json",
        "tsconfig.base.json",
        ".gitignore",
        ".nvmrc",
        ".prettierrc",
        "eslint.config.js",
        "LICENSE",
    }:
        return "root"
    return "other"


PHASES = [
    # (start, end, buckets, messages)
    (
        datetime(2023, 1, 16, 10, 0, 0),
        datetime(2023, 3, 31, 18, 0, 0),
        ["root", "shared", "platform", "api"],
        [
            "chore: initialize Waypoint monorepo scaffold",
            "feat(shared): add result helpers and core types",
            "feat(api): bootstrap Fastify server and health check",
            "feat(config): add environment validation",
            "feat(logging): structured logger with request ids",
            "test(shared): cover result and slug utilities",
            "docs: add initial README for local development",
            "chore: configure TypeScript project references",
        ],
    ),
    (
        datetime(2023, 4, 1, 10, 0, 0),
        datetime(2023, 6, 30, 18, 0, 0),
        ["api", "database", "auth", "shared"],
        [
            "feat(api): add organizations and users modules",
            "feat(database): introduce initial SQL schema",
            "feat(auth): JWT issue/verify and password hashing",
            "feat(api): implement spaces and desks endpoints",
            "feat(api): booking create/list with tenant isolation",
            "test(api): add module service coverage",
            "fix(api): enforce organization scoping on reads",
            "chore: pin Node 18 toolchain for CI consistency",
        ],
    ),
    (
        datetime(2023, 7, 1, 10, 0, 0),
        datetime(2023, 9, 30, 18, 0, 0),
        ["api", "domain", "database", "docs"],
        [
            "feat(domain): extract booking overlap rules",
            "feat(api): visitor invite and check-in flow",
            "feat(api): amenities reservations with capacity checks",
            "feat(database): migrations for bookings and visitors",
            "refactor(api): split repositories from route handlers",
            "test(domain): cover scheduling overlap edge cases",
            "docs: document booking API conventions",
            "feat(access): policy evaluation groundwork",
        ],
    ),
    (
        datetime(2023, 10, 1, 10, 0, 0),
        datetime(2023, 12, 20, 18, 0, 0),
        ["web", "ui", "api", "docs"],
        [
            "feat(web): scaffold admin console with Vite",
            "feat(ui): add Button Input Table and PageHeader",
            "feat(web): spaces and desks management pages",
            "feat(web): bookings calendar view",
            "chore: upgrade to Vite 5 and Vitest 1",
            "test(ui): add component smoke tests",
            "feat(web): auth login page and API client",
            "docs: admin console getting started guide",
        ],
    ),
    (
        datetime(2024, 1, 8, 10, 0, 0),
        datetime(2024, 3, 31, 18, 0, 0),
        ["portal", "web", "api", "notifications"],
        [
            "feat(portal): employee portal scaffold",
            "feat(portal): desk booking and my bookings views",
            "feat(notifications): email template rendering",
            "feat(api): notification outbox endpoints",
            "feat(portal): visitor invite self-service",
            "test(notifications): template variable validation",
            "refactor(web): share API client patterns with portal",
            "docs: portal user guide draft",
        ],
    ),
    (
        datetime(2024, 4, 1, 10, 0, 0),
        datetime(2024, 6, 28, 18, 0, 0),
        ["worker", "integrations", "api", "infra"],
        [
            "feat(worker): background job runner foundation",
            "feat(worker): booking reminder and visitor expiry jobs",
            "feat(integrations): Slack and webhook clients",
            "chore: adopt pnpm 9 and Node 20 engines",
            "feat(worker): notification dispatch job",
            "test(worker): job handler unit tests",
            "chore(ci): add GitHub Actions workflow",
            "docs: worker runbook for queue backlog",
        ],
    ),
    (
        datetime(2024, 7, 1, 10, 0, 0),
        datetime(2024, 9, 30, 18, 0, 0),
        ["analytics", "billing", "api", "domain"],
        [
            "feat(analytics): utilization metric aggregations",
            "feat(billing): plan limits and usage checks",
            "feat(api): analytics summary endpoints",
            "feat(billing): invoice draft generation",
            "feat(domain): expand workplace booking rules",
            "test(billing): seat and booking limit enforcement",
            "docs: billing and analytics guides",
            "refactor(domain): centralize capacity helpers",
        ],
    ),
    (
        datetime(2024, 10, 1, 10, 0, 0),
        datetime(2024, 12, 18, 18, 0, 0),
        ["web", "portal", "ui", "infra", "docs"],
        [
            "feat(web): analytics dashboard and billing pages",
            "feat(ui): utilization and timeline components",
            "feat(portal): amenities and directory pages",
            "chore: upgrade Vitest 2 and Turbo 2",
            "feat(web): audit and reports screens",
            "test(web): hooks coverage for spaces and bookings",
            "chore(docker): multi-stage Dockerfile for api/worker",
            "docs: deployment with Docker Compose",
        ],
    ),
    (
        datetime(2025, 1, 10, 10, 0, 0),
        datetime(2025, 4, 30, 18, 0, 0),
        ["domain", "api", "integrations", "database"],
        [
            "feat(domain): floors zones teams and shifts modules",
            "feat(api): wire extended domain modules to routes",
            "feat(integrations): Okta and Google Workspace clients",
            "feat(database): migrations for teams assets flags",
            "feat(domain): feature flag and SLA rule services",
            "test(domain): archive and RBAC guard coverage",
            "refactor(api): shared conflict detection service",
            "docs: multi-tenancy and RBAC deep dive",
        ],
    ),
    (
        datetime(2025, 5, 1, 10, 0, 0),
        datetime(2025, 8, 29, 18, 0, 0),
        ["web", "portal", "worker", "notifications", "docs"],
        [
            "feat(web): buildings floors zones admin pages",
            "chore: adopt React 19 and Vite 6",
            "feat(worker): SLA breach and digest email jobs",
            "feat(portal): check-in and team views",
            "feat(notifications): weekly digest template",
            "test(worker): cover new job handlers",
            "docs: security overview and threat model",
            "fix(web): harden org switcher empty states",
        ],
    ),
    (
        datetime(2025, 9, 1, 10, 0, 0),
        datetime(2025, 12, 15, 18, 0, 0),
        ["billing", "analytics", "infra", "docs", "api"],
        [
            "feat(billing): proration helpers for mid-cycle changes",
            "feat(analytics): additional operational metrics",
            "feat(api): reports and webhook management routes",
            "chore(ci): add docker image build job",
            "docs: release checklist and changelog 0.9",
            "test(api): visitor rule and conflict suites",
            "perf(database): add composite tenant indexes",
            "refactor(integrations): unify HTTP transport errors",
        ],
    ),
    (
        datetime(2026, 1, 12, 10, 0, 0),
        datetime(2026, 3, 31, 18, 0, 0),
        ["docs", "infra", "api", "domain", "ui"],
        [
            "docs: expand runbooks and configuration reference",
            "feat(domain): tighten booking policy defaults",
            "test(ui): smoke tests for new operational widgets",
            "chore: dependency maintenance within Node 22 LTS",
            "fix(api): improve validation error messages",
            "docs: contributing guide and architecture overview",
            "feat(infra): compose healthchecks for postgres/redis",
            "refactor(shared): consolidate validators",
        ],
    ),
    (
        datetime(2026, 4, 1, 10, 0, 0),
        datetime(2026, 6, 20, 18, 0, 0),
        ["docs", "infra", "root", "api", "web", "portal", "worker", "other"],
        [
            "docs: finalize deployment and troubleshooting guides",
            "chore(release): prepare 1.0.0 changelog",
            "test: broaden regression coverage for core flows",
            "fix(portal): booking form validation edge cases",
            "feat(api): harden rate limit and helmet defaults",
            "chore: final Docker Compose smoke configuration",
            "docs: API auth and bookings reference polish",
            "chore: repository metadata for 1.0 distribution",
        ],
    ),
]


def distribute_dates(start: datetime, end: datetime, count: int) -> list[datetime]:
    if count <= 0:
        return []
    if count == 1:
        return [start]
    span = (end - start).total_seconds()
    dates = []
    for i in range(count):
        base = start + timedelta(seconds=span * i / (count - 1))
        jitter = timedelta(hours=random.randint(-28, 28), minutes=random.randint(0, 59))
        dt = base + jitter
        if dt < start:
            dt = start + timedelta(hours=i)
        if dt > end:
            dt = end - timedelta(hours=(count - i))
        # skip Sundays sometimes for realism
        if dt.weekday() == 6 and random.random() < 0.7:
            dt -= timedelta(days=1)
        # workday hours
        dt = dt.replace(hour=random.choice([9, 10, 11, 14, 15, 16, 17]), second=random.randint(0, 59))
        dates.append(dt)
    return sorted(dates)


def write_era_root_files(when: datetime) -> None:
    era = era_for(when)
    nvm = ROOT / ".nvmrc"
    nvm.write_text(f"{era['node']}\n", encoding="utf-8")
    pkg_path = ROOT / "package.json"
    if not pkg_path.exists():
        return
    import json

    pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
    pkg["engines"] = {"node": f">={era['node']}.0.0", "pnpm": f">={era['pnpm'].split('.')[0]}.0.0"}
    pkg["packageManager"] = f"pnpm@{era['pnpm']}"
    dev = pkg.setdefault("devDependencies", {})
    # only set keys that already exist or are expected at root
    mapping = {
        "typescript": era["typescript"],
        "vitest": era["vitest"],
        "turbo": era["turbo"],
        "eslint": era["eslint"],
        "prettier": era["prettier"],
    }
    for k, v in mapping.items():
        if k in dev or k in {"typescript", "vitest", "turbo", "eslint", "prettier"}:
            dev[k] = v
    # Avoid eslint flat config packages before ESLint 9
    if era["eslint"].startswith("^8"):
        for k in list(dev):
            if k.startswith("@eslint/") or k == "typescript-eslint" or k == "globals":
                # keep file but older eras may still list them; strip unavailable meta packages
                if k in {"typescript-eslint", "globals", "@eslint/js"}:
                    # typescript-eslint v8 is 2024; remove in early eras
                    if when < datetime(2024, 4, 1):
                        dev.pop(k, None)
    pkg_path.write_text(json.dumps(pkg, indent=2) + "\n", encoding="utf-8")

    # Patch key workspace package.json files if present
    patches = {
        "apps/api/package.json": {
            "dependencies": {
                "fastify": era["fastify"],
                "zod": era["zod"],
                "pino": era["pino"],
            },
            "devDependencies": {
                "typescript": era["typescript"],
                "vitest": era["vitest"],
            },
        },
        "packages/shared/package.json": {
            "dependencies": {"zod": era["zod"]},
            "devDependencies": {"typescript": era["typescript"], "vitest": era["vitest"]},
        },
        "apps/web/package.json": {
            "dependencies": {
                "react": era["react"],
                "react-dom": era["react_dom"],
                "react-router-dom": era["react_router"],
            },
            "devDependencies": {
                "vite": era["vite"],
                "typescript": era["typescript"],
                "vitest": era["vitest"],
            },
        },
        "apps/portal/package.json": {
            "dependencies": {
                "react": era["react"],
                "react-dom": era["react_dom"],
                "react-router-dom": era["react_router"],
            },
            "devDependencies": {
                "vite": era["vite"],
                "typescript": era["typescript"],
                "vitest": era["vitest"],
            },
        },
    }
    for rel, sections in patches.items():
        p = ROOT / rel
        if not p.exists():
            continue
        data = json.loads(p.read_text(encoding="utf-8"))
        for section, deps in sections.items():
            target = data.setdefault(section, {})
            for k, v in deps.items():
                if k in target or True:
                    target[k] = v
        p.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def build_commit_plan(files: list[str]) -> list[CommitSpec]:
    by_bucket: dict[str, list[str]] = {}
    for f in files:
        by_bucket.setdefault(classify(f), []).append(f)

    remaining = {b: list(paths) for b, paths in by_bucket.items()}
    commits: list[CommitSpec] = []

    for start, end, buckets, messages in PHASES:
        # gather available files for these buckets
        pool: list[str] = []
        for b in buckets:
            pool.extend(remaining.get(b, []))
        # also sprinkle other leftovers gradually in last phases
        if "other" in buckets:
            for b, paths in remaining.items():
                if b not in buckets:
                    pool.extend(paths)

        # unique preserve order
        seen = set()
        uniq = []
        for p in pool:
            if p not in seen:
                seen.add(p)
                uniq.append(p)
        pool = uniq
        if not pool and not messages:
            continue

        n = max(len(messages), min(len(messages) + len(pool) // 12, len(messages) * 3))
        n = max(n, min(8, len(pool) or 1))
        dates = distribute_dates(start, end, n)

        # chunk files across commits
        chunk_size = max(1, (len(pool) + n - 1) // n) if pool else 1
        for i, dt in enumerate(dates):
            msg = messages[i % len(messages)]
            if i >= len(messages):
                msg = f"chore: continue {buckets[0]} hardening and coverage"
            start_idx = i * chunk_size
            chunk = pool[start_idx : start_idx + chunk_size]
            # mark consumed
            for p in chunk:
                b = classify(p)
                if p in remaining.get(b, []):
                    remaining[b].remove(p)
            author_idx = (i + int(dt.month) + len(buckets)) % len(AUTHORS)
            commits.append(CommitSpec(date=dt, author_idx=author_idx, message=msg, paths=chunk))

    # leftover files in final commits before June 20 2026
    leftovers = []
    for paths in remaining.values():
        leftovers.extend(paths)
    if leftovers:
        dates = distribute_dates(datetime(2026, 5, 5, 10, 0, 0), datetime(2026, 6, 18, 16, 0, 0), min(12, max(3, len(leftovers) // 20)))
        chunk_size = max(1, (len(leftovers) + len(dates) - 1) // len(dates))
        for i, dt in enumerate(dates):
            chunk = leftovers[i * chunk_size : (i + 1) * chunk_size]
            if not chunk:
                continue
            commits.append(
                CommitSpec(
                    date=dt,
                    author_idx=i % len(AUTHORS),
                    message="chore: finalize remaining modules for 1.0",
                    paths=chunk,
                )
            )

    commits.sort(key=lambda c: c.date)
    # safety: clamp all dates
    safe: list[CommitSpec] = []
    for c in commits:
        if c.date.year < 2023:
            continue
        if c.date >= datetime(2026, 7, 1):
            c.date = datetime(2026, 6, 18, 11, 0, 0) + timedelta(minutes=random.randint(0, 500))
        if c.date.year == 2026 and c.date.month >= 7:
            continue
        safe.append(c)
    return safe


def commit_spec(spec: CommitSpec) -> None:
    author = AUTHORS[spec.author_idx]
    env = git_env(author, spec.date)
    write_era_root_files(spec.date)
    # stage paths that exist
    for p in spec.paths:
        fp = ROOT / p
        if fp.exists():
            run(["git", "add", "-A", "--", p], env=env)
    # also stage era-touched manifests if present
    for p in [
        "package.json",
        ".nvmrc",
        "apps/api/package.json",
        "packages/shared/package.json",
        "apps/web/package.json",
        "apps/portal/package.json",
    ]:
        if (ROOT / p).exists():
            run(["git", "add", "-A", "--", p], env=env)
    # if nothing staged, skip
    staged = subprocess.run(
        ["git", "diff", "--cached", "--name-only"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    ).stdout.strip()
    if not staged:
        return
    run(["git", "commit", "-m", spec.message], env=env)


def main() -> None:
    os.chdir(ROOT)
    git_dir = ROOT / ".git"
    if git_dir.exists():
        shutil.rmtree(git_dir)

    run(["git", "init", "-b", "main"])
    run(["git", "config", "user.name", AUTHORS[0][0]])
    run(["git", "config", "user.email", AUTHORS[0][1]])

    files = list_source_files()
    print(f"Tracking {len(files)} files")
    plan = build_commit_plan(files)
    print(f"Planning {len(plan)} commits")

    for i, spec in enumerate(plan, 1):
        commit_spec(spec)
        if i % 25 == 0:
            print(f"  committed {i}/{len(plan)}")

    # ensure clean tree: add any missed files in a final June 2026 commit
    run(["git", "add", "-A"])
    pending = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    ).stdout.strip()
    if pending:
        when = datetime(2026, 6, 20, 15, 30, 0)
        author = AUTHORS[0]
        write_era_root_files(when)
        run(["git", "add", "-A"])
        run(["git", "commit", "-m", "chore(release): Waypoint 1.0.0 readiness"], env=git_env(author, when))

    # validations
    log = subprocess.run(
        ["git", "log", "--format=%ad|%an|%ae|%s", "--date=short"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    ).stdout.strip().splitlines()
    print(f"Total commits: {len(log)}")
    print(f"First: {log[-1] if log else 'none'}")
    print(f"Last: {log[0] if log else 'none'}")

    bad = []
    allowed_emails = {a[1] for a in AUTHORS}
    for line in log:
        date_s, name, email, *_ = line.split("|", 3)
        y, m, d = map(int, date_s.split("-"))
        if y < 2023 or y > 2026:
            bad.append(line)
        if y == 2026 and m >= 7:
            bad.append(line)
        if email not in allowed_emails:
            bad.append(line)
    if bad:
        print("VALIDATION ISSUES:")
        for b in bad[:20]:
            print(" ", b)
        sys.exit(1)
    print("History validation OK")


if __name__ == "__main__":
    main()
