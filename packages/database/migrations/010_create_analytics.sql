CREATE TABLE IF NOT EXISTS analytics_rollups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  bookings_count INT NOT NULL DEFAULT 0,
  visitors_count INT NOT NULL DEFAULT 0,
  occupancy_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
  revenue_cents INT NOT NULL DEFAULT 0,
  refreshed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (org_id, date)
);
