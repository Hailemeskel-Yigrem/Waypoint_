# Waypoint database

This package owns the PostgreSQL schema, versioned migrations, typed repositories,
daily analytics rollup, and executable data-quality checks.

## Migration guarantees

Migrations live in `migrations/` and run in filename order. The runner:

- takes a PostgreSQL advisory lock so only one process migrates at a time;
- executes every migration on one checked-out connection and inside a transaction;
- records a SHA-256 checksum in `schema_migrations` and rejects modified history;
- safely skips migrations already recorded in the ledger.

Build the package before invoking its CLI:

```bash
pnpm --filter @waypoint/database build
DATABASE_URL=postgres://waypoint:waypoint@localhost:5432/waypoint \
  pnpm --filter @waypoint/database migrate
```

## Data lineage

| Source-of-truth tables                | Transformation                                  | Output               |
| ------------------------------------- | ----------------------------------------------- | -------------------- |
| `bookings`, `desks`                   | Active daily booking count and desk utilization | `analytics_rollups`  |
| `visitors`                            | Expected visitors grouped by tenant/day         | `analytics_rollups`  |
| `invoices`                            | Paid revenue for periods covering the day       | `analytics_rollups`  |
| `analytics_rollups`, migration ledger | Referential and numeric-range checks            | CI data-quality gate |
| Every analytics rollup execution      | Idempotent run-ledger upsert                    | `pipeline_runs`      |

`refreshAnalyticsRollup` is keyed by organization and business date. Retrying the
same job rebuilds that row from source tables and increments one `pipeline_runs`
ledger record; it never appends duplicate aggregates. Booking and visitor timestamps
are assigned to a business date in the tenant's configured timezone.

## Integration and quality tests

Start the disposable database and run the same PostgreSQL suite used in CI:

```bash
docker compose -f docker-compose.test.yml up -d --wait postgres
TEST_DATABASE_URL=postgres://waypoint_test:waypoint_test@localhost:55432/waypoint_test \
  pnpm --filter @waypoint/database test:integration
TEST_DATABASE_URL=postgres://waypoint_test:waypoint_test@localhost:55432/waypoint_test \
  pnpm --filter @waypoint/api test:integration:db
docker compose -f docker-compose.test.yml down -v
```

The suite applies all migrations twice, verifies checksums, asserts database-level
booking conflict protection, rebuilds an analytics rollup twice, and gates orphan,
duration, and aggregate-range invariants. The API suite drives `BookingService`
through its PostgreSQL repository and verifies a persisted conflict result.
