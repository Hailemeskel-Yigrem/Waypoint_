# API Overview

The Waypoint API is a JSON HTTP API served by Fastify.

## Conventions

- Base path: `/v1`
- Auth: Bearer JWT
- Tenant context: derived from JWT claims and optional `X-Organization-Id`
- Errors: `{ "error": { "code": string, "message": string } }`
- Pagination: `limit`, `offset`, response includes `meta.total` when available
