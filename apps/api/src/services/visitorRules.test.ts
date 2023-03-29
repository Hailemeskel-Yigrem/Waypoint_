import { describe, it, expect } from 'vitest';
import { canCheckIn, shouldExpire, normalizeVisitorEmail } from './visitorRules.js';

const invite = {
  id: 'v1',
  organizationId: 'org',
  hostUserId: 'host',
  visitorEmail: 'Guest@Example.com',
  arrivesAt: '2024-03-01T15:00:00Z',
  departsAt: '2024-03-01T17:00:00Z',
  status: 'invited' as const,
};

describe('visitorRules', () => {
  it('allows check-in within window', () => {
    expect(canCheckIn(invite, '2024-03-01T14:45:00Z')).toBe(true);
  });

  it('expires after departure', () => {
    expect(shouldExpire(invite, '2024-03-01T18:00:00Z')).toBe(true);
  });

  it('normalizes email', () => {
    expect(normalizeVisitorEmail(invite.visitorEmail)).toBe('guest@example.com');
  });
});
