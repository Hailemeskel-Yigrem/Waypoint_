export interface VisitorInvite {
  id: string;
  organizationId: string;
  hostUserId: string;
  visitorEmail: string;
  arrivesAt: string;
  departsAt: string;
  status: 'invited' | 'checked_in' | 'checked_out' | 'cancelled' | 'expired';
}

export function canCheckIn(invite: VisitorInvite, nowIso: string): boolean {
  if (invite.status !== 'invited') return false;
  const now = Date.parse(nowIso);
  const start = Date.parse(invite.arrivesAt) - 30 * 60_000;
  const end = Date.parse(invite.departsAt);
  return now >= start && now <= end;
}

export function shouldExpire(invite: VisitorInvite, nowIso: string): boolean {
  if (
    invite.status === 'checked_out' ||
    invite.status === 'cancelled' ||
    invite.status === 'expired'
  ) {
    return false;
  }
  return Date.parse(nowIso) > Date.parse(invite.departsAt);
}

export function normalizeVisitorEmail(email: string): string {
  return email.trim().toLowerCase();
}
