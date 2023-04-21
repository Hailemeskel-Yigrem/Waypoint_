-- performance indexes
BEGIN;

CREATE TABLE IF NOT EXISTS waypoint_indexes (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_indexes_org
  ON waypoint_indexes (organization_id);

CREATE INDEX IF NOT EXISTS idx_indexes_org_status
  ON waypoint_indexes (organization_id, status);

COMMIT;
