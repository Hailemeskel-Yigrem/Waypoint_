-- notification outbox
BEGIN;

CREATE TABLE IF NOT EXISTS waypoint_notifications (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_org
  ON waypoint_notifications (organization_id);

CREATE INDEX IF NOT EXISTS idx_notifications_org_status
  ON waypoint_notifications (organization_id, status);

COMMIT;
