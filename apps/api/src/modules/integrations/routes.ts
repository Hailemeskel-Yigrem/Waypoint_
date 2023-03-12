import type { FastifyInstance } from 'fastify';
import { IntegrationService } from './service.js';
import {
  createIntegrationSchema,
  updateIntegrationSchema,
  integrationIdParamSchema,
} from './schema.js';
import { paginationQuerySchema } from '../../lib/pagination.js';
import { throwIfError } from '../../middleware/errorHandler.js';
import { requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';

export function registerIntegrationRoutes(app: FastifyInstance): void {
  const service = new IntegrationService(app.repos.integrations);

  app.register(async (scoped) => {
    scoped.addHook('preHandler', app.authHook);
    scoped.addHook('preHandler', tenantMiddleware);

    scoped.post(
      '/integrations',
      { preHandler: requireRole('owner', 'admin') },
      async (request, reply) => {
        const body = createIntegrationSchema.parse(request.body);
        reply
          .status(201)
          .send({ data: throwIfError(await service.create(request.tenantId, body)) });
      },
    );

    scoped.get('/integrations', async (request, reply) => {
      const query = paginationQuerySchema.parse(request.query);
      reply.send({ data: await service.list(request.tenantId, query) });
    });

    scoped.patch(
      '/integrations/:integrationId',
      { preHandler: requireRole('owner', 'admin') },
      async (request, reply) => {
        const { integrationId } = integrationIdParamSchema.parse(request.params);
        const body = updateIntegrationSchema.parse(request.body);
        reply.send({
          data: throwIfError(await service.update(request.tenantId, integrationId, body)),
        });
      },
    );

    scoped.post(
      '/integrations/:integrationId/activate',
      { preHandler: requireRole('owner', 'admin') },
      async (request, reply) => {
        const { integrationId } = integrationIdParamSchema.parse(request.params);
        reply.send({ data: throwIfError(await service.activate(request.tenantId, integrationId)) });
      },
    );

    scoped.delete(
      '/integrations/:integrationId',
      { preHandler: requireRole('owner', 'admin') },
      async (request, reply) => {
        const { integrationId } = integrationIdParamSchema.parse(request.params);
        throwIfError(await service.delete(request.tenantId, integrationId));
        reply.status(204).send();
      },
    );
  });
}
