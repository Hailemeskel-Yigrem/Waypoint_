# Waypoint

Multi-tenant workplace operations platform for managing spaces, desks, bookings, visitors, amenities, analytics, and billing.

## Monorepo structure

| Package / App             | Description                                     |
| ------------------------- | ----------------------------------------------- |
| `@waypoint/api`           | Fastify HTTP API                                |
| `@waypoint/web`           | Admin console (React + Vite)                    |
| `@waypoint/portal`        | Employee portal (React + Vite)                  |
| `@waypoint/worker`        | Background job processor                        |
| `@waypoint/shared`        | Shared types, Zod schemas, constants, utilities |
| `@waypoint/domain`        | Domain rules and aggregates                     |
| `@waypoint/logging`       | Structured JSON logging with correlation        |
| `@waypoint/config`        | Environment configuration with validation       |
| `@waypoint/auth`          | JWT, password hashing, RBAC                     |
| `@waypoint/ui`            | React component library                         |
| `@waypoint/database`      | PostgreSQL schema, migrations, repositories     |
| `@waypoint/billing`       | Billing helpers                                 |
| `@waypoint/analytics`     | Analytics helpers                               |
| `@waypoint/notifications` | Notification templates                          |
| `@waypoint/integrations`  | External integration helpers                    |

## Prerequisites

- Node.js 22+
- pnpm 9+
- PostgreSQL 15+ (for database package)
- Redis 7+ (optional, for worker queue)
- Docker Desktop (optional, for Compose stack)

## Getting started

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm test
```

Copy `.env.example` to `.env` and set a `JWT_SECRET` of at least 16 characters before starting the API.

VS Code users can also open the repository in the included dev container; it installs the locked workspace dependencies and forwards all application and infrastructure ports.

### Development

```bash
# Run all apps in dev mode
pnpm dev

# Run individual apps
pnpm --filter @waypoint/api dev
pnpm --filter @waypoint/web dev
pnpm --filter @waypoint/portal dev
pnpm --filter @waypoint/worker dev
```

API health endpoints:

- `GET /api/v1/health`
- `GET /api/v1/health/ready`
- `GET /api/v1/metrics` (Prometheus text format)

### Quality checks

Run the same checks enforced by CI:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm audit --prod --audit-level high
pnpm build
```

Portal coverage is enforced at 70% line coverage for its tested data hooks and booking engine.

### Database

```bash
# Apply migrations (requires DATABASE_URL)
pnpm --filter @waypoint/database migrate
pnpm --filter @waypoint/database seed
```

The versioned migration runner uses advisory locking, per-migration transactions, and SHA-256 checksums. PostgreSQL integration and data-quality tests run in their own required CI job. To run them locally:

```bash
docker compose -f docker-compose.test.yml up -d --wait postgres
TEST_DATABASE_URL=postgres://waypoint_test:waypoint_test@localhost:55432/waypoint_test \
  pnpm --filter @waypoint/database test:integration
TEST_DATABASE_URL=postgres://waypoint_test:waypoint_test@localhost:55432/waypoint_test \
  pnpm --filter @waypoint/api test:integration:db
docker compose -f docker-compose.test.yml down -v
```

See [`packages/database/README.md`](./packages/database/README.md) for schema migration guarantees and analytics lineage.

### Docker

```bash
docker compose up --build
```

This starts Postgres, Redis, API, worker, and local web/portal frontends. See [docs/deployment/docker.md](./docs/deployment/docker.md).

## Environment variables

See [`.env.example`](./.env.example):

- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection (worker queue)
- `JWT_SECRET` — Secret for signing tokens (minimum 16 characters)
- `NODE_ENV` — Runtime environment (`development`, `test`, or `production`)
- `USE_MEMORY_REPOS` — Use in-memory repositories for local development and tests
- `LOG_PRETTY` — Enable human-readable local logs; disable for structured production JSON
- `VITE_API_URL` — API base URL for web/portal apps

## Documentation

Additional guides live under [`docs/`](./docs/).

## License

MIT — see [LICENSE](./LICENSE).
