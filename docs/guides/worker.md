# Worker

Background jobs and retry semantics.

## Overview

Waypoint keeps workplace operations consistent across admin console, employee portal, API, and worker processes.

## Steps

1. Confirm environment variables from `.env.example`
2. Run `pnpm install`
3. Apply database migrations
4. Start API and dependent services
5. Verify health endpoints and smoke tests

## Notes

- Prefer domain rules in `@waypoint/domain`
- Keep every query tenant-scoped
- Emit structured logs with request correlation IDs
