import jwt, { type SignOptions } from 'jsonwebtoken';
import type { SessionUser } from './session.js';

export interface JwtPayload {
  sub: string;
  orgId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface JwtOptions {
  secret: string;
  expiresIn?: SignOptions['expiresIn'];
  issuer?: string;
}

export function issueToken(user: SessionUser, options: JwtOptions): string {
  const payload: JwtPayload = {
    sub: user.id,
    orgId: user.orgId,
    email: user.email,
    role: user.role,
  };
  const signOptions: SignOptions = {
    expiresIn: options.expiresIn ?? '7d',
    issuer: options.issuer ?? 'waypoint',
  };
  return jwt.sign(payload, options.secret, signOptions);
}

export function verifyToken(token: string, secret: string): JwtPayload {
  const decoded = jwt.verify(token, secret, { issuer: 'waypoint' });
  if (typeof decoded === 'string') throw new Error('Invalid token payload');
  return decoded as JwtPayload;
}

export function decodeToken(token: string): JwtPayload | null {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded === 'string') return null;
  return decoded as JwtPayload;
}

export function payloadToSessionUser(payload: JwtPayload): SessionUser {
  return {
    id: payload.sub,
    orgId: payload.orgId,
    email: payload.email,
    role: payload.role as SessionUser['role'],
  };
}
