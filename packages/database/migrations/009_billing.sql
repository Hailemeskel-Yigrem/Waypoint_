-- plans, subscriptions, invoices
BEGIN;

CREATE TABLE IF NOT EXISTS waypoint_billing (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_billing_org
  ON waypoint_billing (organization_id);

CREATE INDEX IF NOT EXISTS idx_billing_org_status
  ON waypoint_billing (organization_id, status);

COMMIT;
