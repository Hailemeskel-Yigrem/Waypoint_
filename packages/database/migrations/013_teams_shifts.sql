-- teams and shifts
BEGIN;

CREATE TABLE IF NOT EXISTS waypoint_teams_shifts (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teams_shifts_org
  ON waypoint_teams_shifts (organization_id);

CREATE INDEX IF NOT EXISTS idx_teams_shifts_org_status
  ON waypoint_teams_shifts (organization_id, status);

COMMIT;
