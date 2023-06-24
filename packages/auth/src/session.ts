import type { UserRole } from '@waypoint/shared';

export interface SessionUser {
  id: string;
  orgId: string;
  email: string;
  role: UserRole;
}

export interface Session {
  user: SessionUser;
  issuedAt: number;
  expiresAt: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export function isSessionExpired(session: Session, now = Date.now()): boolean {
  return now >= session.expiresAt;
}
