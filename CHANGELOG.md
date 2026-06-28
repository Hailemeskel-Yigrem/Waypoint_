# Changelog

All notable changes to Waypoint are documented in this file.

## [Unreleased]

## [0.2.0] - 2026-06-28

### Added

- PostgreSQL-backed migration, booking-invariant, analytics, and data-quality integration tests
- Idempotent daily analytics rollup with an auditable pipeline-run ledger
- Root-level workspace contract suite and a ready-to-use development container

### Changed

- Consolidated duplicate database schemas into one checksummed, advisory-locked migration tree
- Made health endpoint and CI quality-gate registration explicit for automated tooling

## [0.1.0] - 2026-06-18

### Added

- Stable API v1 surface
- Admin console and employee portal
- Docker Compose production-like stack
