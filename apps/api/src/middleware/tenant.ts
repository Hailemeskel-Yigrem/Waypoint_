import type { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../lib/errors.js';

declare module 'fastify' {
  interface FastifyRequest {
    tenantId: string;
  }
}

export async function tenantMiddleware(
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  const headerTenant = request.headers['x-organization-id'];
  const paramTenant = (request.params as Record<string, string | undefined>)?.organizationId;

  if (!request.auth) {
    throw AppError.unauthorized();
  }

  const tenantId =
    typeof headerTenant === 'string' && headerTenant.length > 0
      ? headerTenant
      : request.auth.organizationId;

  if (paramTenant && paramTenant !== tenantId) {
    throw AppError.tenantMismatch();
  }

  if (tenantId !== request.auth.organizationId && request.auth.role !== 'owner') {
    throw AppError.forbidden('Cannot access resources outside your organization');
  }

  request.tenantId = tenantId;
}

export function scopeToTenant<T extends { organizationId: string }>(
  organizationId: string,
  entity: T,
): T {
  if (entity.organizationId !== organizationId) {
    throw AppError.tenantMismatch();
  }
  return entity;
}

export function filterByTenant<T extends { organizationId: string }>(
  organizationId: string,
  items: T[],
): T[] {
  return items.filter((item) => item.organizationId === organizationId);
}
