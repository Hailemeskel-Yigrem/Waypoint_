-- Deterministic local-only fixtures. The sentinel password value cannot authenticate.
INSERT INTO organizations (id, name, slug, plan, status, settings)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Acme Corp',
  'acme-corp',
  'starter',
  'active',
  '{"visitorCheckInWindowMinutes": 30}'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO users (id, org_id, email, name, role, status, password_hash)
VALUES
  (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'admin@acme.example',
    'Admin User',
    'owner',
    'active',
    '!local-seed-login-disabled!'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'member@acme.example',
    'Jane Member',
    'member',
    'active',
    '!local-seed-login-disabled!'
  )
ON CONFLICT (org_id, email) DO NOTHING;

INSERT INTO spaces (id, org_id, name, slug, type, capacity)
VALUES
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'Floor 3 Open Area',
    'floor-3-open',
    'office',
    50
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Conference Room A',
    'conf-a',
    'meeting_room',
    8
  )
ON CONFLICT (org_id, slug) DO NOTHING;
