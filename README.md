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
pnpm install
pnpm build
pnpm test
```

Copy `.env.example` to `.env` and set a `JWT_SECRET` of at least 16 characters before starting the API.

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

### Database

```bash
# Apply migrations (requires DATABASE_URL)
pnpm --filter @waypoint/database migrate
pnpm --filter @waypoint/database seed
```

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
- `VITE_API_URL` — API base URL for web/portal apps

## Documentation

Additional guides live under [`docs/`](./docs/).

## License

MIT — see [LICENSE](./LICENSE).
