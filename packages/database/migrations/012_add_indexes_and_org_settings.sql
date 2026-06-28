CREATE INDEX IF NOT EXISTS idx_users_org ON users (org_id);
CREATE INDEX IF NOT EXISTS idx_spaces_org ON spaces (org_id);
CREATE INDEX IF NOT EXISTS idx_desks_org_space ON desks (org_id, space_id);
CREATE INDEX IF NOT EXISTS idx_bookings_org_dates ON bookings (org_id, start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_visitors_org_status ON visitors (org_id, status);
CREATE INDEX IF NOT EXISTS idx_analytics_org_date ON analytics_rollups (org_id, date);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_pending
  ON webhook_deliveries (status, created_at)
  WHERE status = 'pending';
