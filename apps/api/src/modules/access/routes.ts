import type { FastifyInstance } from 'fastify';
import { AccessService } from './service.js';
import { createAccessPolicySchema, policyIdParamSchema } from './schema.js';
import { paginationQuerySchema } from '../../lib/pagination.js';
import { throwIfError } from '../../middleware/errorHandler.js';
import { requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';

export function registerAccessRoutes(app: FastifyInstance): void {
  const service = new AccessService(app.repos.access, app.repos.users);

  app.register(async (scoped) => {
    scoped.addHook('preHandler', app.authHook);
    scoped.addHook('preHandler', tenantMiddleware);

    scoped.post(
      '/access/policies',
      { preHandler: requireRole('owner', 'admin') },
      async (request, reply) => {
        const body = createAccessPolicySchema.parse(request.body);
        reply
          .status(201)
          .send({ data: throwIfError(await service.create(request.tenantId, body)) });
      },
    );

    scoped.get('/access/policies', async (request, reply) => {
      const query = paginationQuerySchema.parse(request.query);
      reply.send({ data: await service.list(request.tenantId, query) });
    });

    scoped.delete(
      '/access/policies/:policyId',
      { preHandler: requireRole('owner', 'admin') },
      async (request, reply) => {
        const { policyId } = policyIdParamSchema.parse(request.params);
        throwIfError(await service.delete(request.tenantId, policyId));
        reply.status(204).send();
      },
    );
  });
}
