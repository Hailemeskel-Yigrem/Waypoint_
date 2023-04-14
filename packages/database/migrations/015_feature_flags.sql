-- feature flags
BEGIN;

CREATE TABLE IF NOT EXISTS waypoint_feature_flags (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feature_flags_org
  ON waypoint_feature_flags (organization_id);

CREATE INDEX IF NOT EXISTS idx_feature_flags_org_status
  ON waypoint_feature_flags (organization_id, status);

COMMIT;
