import type { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../lib/errors.js';
import type { AuthContext } from '../lib/types.js';
import { hashToken, signPayload, verifySignature } from '../lib/crypto.js';
import type { UserRepository } from '../modules/users/repository.js';

declare module 'fastify' {
  interface FastifyRequest {
    auth: AuthContext | null;
  }
}

export interface AuthOptions {
  jwtSecret: string;
  apiKeySalt: string;
  userRepo: UserRepository;
  optional?: boolean;
}

function parseBearerToken(header: string | undefined): string | null {
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

function decodeJwtPayload(token: string, secret: string): AuthContext | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signature] = parts;
  const signingInput = `${headerB64}.${payloadB64}`;
  if (!verifySignature(signingInput, signature, secret)) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as {
      sub: string;
      org: string;
      role: AuthContext['role'];
      email: string;
      exp: number;
    };
    if (payload.exp * 1000 < Date.now()) return null;
    return {
      userId: payload.sub,
      organizationId: payload.org,
      role: payload.role,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

export function createAuthMiddleware(options: AuthOptions) {
  return async function authMiddleware(
    request: FastifyRequest,
    _reply: FastifyReply,
  ): Promise<void> {
    const token = parseBearerToken(request.headers.authorization);

    if (!token) {
      if (options.optional) {
        request.auth = null;
        return;
      }
      throw AppError.unauthorized('Missing or invalid authorization header');
    }

    if (token.startsWith('wpk_')) {
      const keyHash = hashToken(token + options.apiKeySalt);
      const user = await options.userRepo.findByApiKeyHash(keyHash);
      if (!user) {
        throw AppError.unauthorized('Invalid API key');
      }
      request.auth = {
        userId: user.id,
        organizationId: user.organizationId,
        role: user.role,
        email: user.email,
      };
      return;
    }

    const auth = decodeJwtPayload(token, options.jwtSecret);
    if (!auth) {
      throw AppError.unauthorized('Invalid or expired token');
    }

    const user = await options.userRepo.findById(auth.organizationId, auth.userId);
    if (!user || user.status !== 'active') {
      throw AppError.unauthorized('User account is inactive or not found');
    }

    request.auth = auth;
  };
}

export function requireRole(...roles: AuthContext['role'][]) {
  return async function roleGuard(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    if (!request.auth) {
      throw AppError.unauthorized();
    }
    if (!roles.includes(request.auth.role)) {
      throw AppError.forbidden(`Requires one of roles: ${roles.join(', ')}`);
    }
  };
}

export function encodeJwt(auth: AuthContext, secret: string, expiresInSec = 86400): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      sub: auth.userId,
      org: auth.organizationId,
      role: auth.role,
      email: auth.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresInSec,
    }),
  ).toString('base64url');
  const signingInput = `${header}.${payload}`;
  const signature = signPayload(signingInput, secret);
  return `${signingInput}.${signature}`;
}
