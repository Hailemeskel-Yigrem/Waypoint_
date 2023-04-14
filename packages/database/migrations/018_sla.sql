-- sla targets and breaches
BEGIN;

CREATE TABLE IF NOT EXISTS waypoint_sla (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sla_org
  ON waypoint_sla (organization_id);

CREATE INDEX IF NOT EXISTS idx_sla_org_status
  ON waypoint_sla (organization_id, status);

COMMIT;
