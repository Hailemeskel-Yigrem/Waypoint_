-- Waypoint seed data
INSERT INTO organizations (id, name, slug, timezone, settings) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Acme Corp', 'acme-corp', 'America/New_York', '{"allowGuestBookings": true, "visitorExpiryHours": 24, "bookingReminderMinutes": 60, "requireVisitorApproval": false}')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO users (id, org_id, email, password_hash, first_name, last_name, role) VALUES
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'admin@acme.example', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2oQKqGKKK.KK.', 'Admin', 'User', 'owner'),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'member@acme.example', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2oQKqGKKK.KK.', 'Jane', 'Member', 'member')
ON CONFLICT DO NOTHING;

INSERT INTO spaces (id, org_id, name, slug, type, capacity) VALUES
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Floor 3 Open Area', 'floor-3-open', 'open_area', 50),
  ('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Conference Room A', 'conf-a', 'meeting_room', 8)
ON CONFLICT DO NOTHING;
