# Waypoint

Multi-tenant workplace operations platform for managing spaces, desks, bookings, visitors, amenities, analytics, and billing.

## Monorepo structure

| Package / App        | Description                                     |
| -------------------- | ----------------------------------------------- |
| `@waypoint/shared`   | Shared types, Zod schemas, constants, utilities |
| `@waypoint/logging`  | Structured JSON logging with correlation        |
| `@waypoint/config`   | Environment configuration with validation       |
| `@waypoint/auth`     | JWT, password hashing, RBAC                     |
| `@waypoint/ui`       | React component library                         |
| `@waypoint/database` | PostgreSQL schema, migrations, repositories     |
| `@waypoint/worker`   | Background job processor                        |
| `@waypoint/web`      | Admin console (React + Vite)                    |
| `@waypoint/portal`   | Employee portal (React + Vite)                  |

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+ (for database package)
- Redis 7+ (optional, for worker queue)

## Getting started

```bash
pnpm install
pnpm build
pnpm test
```

### Development

```bash
# Run all apps in dev mode
pnpm dev

# Run individual apps
pnpm --filter @waypoint/web dev
pnpm --filter @waypoint/portal dev
pnpm --filter @waypoint/worker dev
```

### Database

```bash
# Apply migrations (requires DATABASE_URL)
pnpm --filter @waypoint/database migrate
pnpm --filter @waypoint/database seed
```

## Environment variables

Copy `.env.example` files in each app and configure:

- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection (worker queue)
- `JWT_SECRET` — Secret for signing tokens
- `VITE_API_URL` — API base URL for web/portal apps

## License

MIT — see [LICENSE](./LICENSE).
