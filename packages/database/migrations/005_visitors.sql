-- visitor invitations and checkins
BEGIN;

CREATE TABLE IF NOT EXISTS waypoint_visitors (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitors_org
  ON waypoint_visitors (organization_id);

CREATE INDEX IF NOT EXISTS idx_visitors_org_status
  ON waypoint_visitors (organization_id, status);

COMMIT;
