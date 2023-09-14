# Waypoint Architecture Overview

Waypoint is a multi-tenant workplace operations platform organized as a TypeScript monorepo.

## Applications

- `@waypoint/api` — HTTP API (Fastify)
- `@waypoint/web` — Admin console
- `@waypoint/portal` — Employee portal
- `@waypoint/worker` — Asynchronous job processor

## Packages

- `@waypoint/shared` — shared types and utilities
- `@waypoint/domain` — domain services and business rules
- `@waypoint/auth` — authentication and RBAC
- `@waypoint/database` — PostgreSQL schema and migrations
- `@waypoint/notifications` — templates and rendering
- `@waypoint/analytics` — metric aggregation helpers
- `@waypoint/logging` / `@waypoint/config` / `@waypoint/ui` — cross-cutting libraries

## Tenancy

Every mutable entity is scoped by `organizationId`. Repositories must filter by tenant on read and write paths.
