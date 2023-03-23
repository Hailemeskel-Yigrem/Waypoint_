import type { FastifyInstance } from 'fastify';
import { SpaceService } from './service.js';
import { createSpaceSchema, updateSpaceSchema, spaceIdParamSchema } from './schema.js';
import { paginationQuerySchema } from '../../lib/pagination.js';
import { throwIfError } from '../../middleware/errorHandler.js';
import { requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';

export function registerSpaceRoutes(app: FastifyInstance): void {
  const service = new SpaceService(app.repos.spaces, app.services.billing);

  app.register(async (scoped) => {
    scoped.addHook('preHandler', app.authHook);
    scoped.addHook('preHandler', tenantMiddleware);

    scoped.post(
      '/spaces',
      { preHandler: requireRole('owner', 'admin', 'manager') },
      async (request, reply) => {
        const body = createSpaceSchema.parse(request.body);
        reply
          .status(201)
          .send({ data: throwIfError(await service.create(request.tenantId, body)) });
      },
    );

    scoped.get('/spaces', async (request, reply) => {
      const query = paginationQuerySchema.parse(request.query);
      reply.send({ data: await service.list(request.tenantId, query) });
    });

    scoped.get('/spaces/:spaceId', async (request, reply) => {
      const { spaceId } = spaceIdParamSchema.parse(request.params);
      reply.send({ data: throwIfError(await service.getById(request.tenantId, spaceId)) });
    });

    scoped.patch(
      '/spaces/:spaceId',
      { preHandler: requireRole('owner', 'admin', 'manager') },
      async (request, reply) => {
        const { spaceId } = spaceIdParamSchema.parse(request.params);
        const body = updateSpaceSchema.parse(request.body);
        reply.send({ data: throwIfError(await service.update(request.tenantId, spaceId, body)) });
      },
    );

    scoped.delete(
      '/spaces/:spaceId',
      { preHandler: requireRole('owner', 'admin') },
      async (request, reply) => {
        const { spaceId } = spaceIdParamSchema.parse(request.params);
        throwIfError(await service.delete(request.tenantId, spaceId));
        reply.status(204).send();
      },
    );
  });
}
