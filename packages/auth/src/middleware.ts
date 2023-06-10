import type { SessionUser } from './session.js';
import { verifyToken, payloadToSessionUser } from './jwt.js';
import { hasPermission, type Permission } from './rbac.js';

export function extractBearerToken(header?: string): string | null {
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7);
}

export function authenticateRequest(authHeader: string | undefined, secret: string): SessionUser {
  const token = extractBearerToken(authHeader);
  if (!token) throw new Error('Missing authorization token');
  return payloadToSessionUser(verifyToken(token, secret));
}

export function authorize(user: SessionUser, permission: Permission): void {
  if (!hasPermission(user.role, permission)) throw new Error('Forbidden');
}
