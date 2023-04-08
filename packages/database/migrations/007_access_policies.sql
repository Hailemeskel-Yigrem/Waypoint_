-- access policies and grants
BEGIN;

CREATE TABLE IF NOT EXISTS waypoint_access_policies (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_access_policies_org
  ON waypoint_access_policies (organization_id);

CREATE INDEX IF NOT EXISTS idx_access_policies_org_status
  ON waypoint_access_policies (organization_id, status);

COMMIT;
