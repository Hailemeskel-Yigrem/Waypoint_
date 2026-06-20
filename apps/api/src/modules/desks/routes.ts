import type { FastifyInstance } from 'fastify';
import { DeskService } from './service.js';
import { createDeskSchema, updateDeskSchema, deskIdParamSchema } from './schema.js';
import { paginationQuerySchema } from '../../lib/pagination.js';
import { z } from 'zod';
import { throwIfError } from '../../middleware/errorHandler.js';
import { requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';

const listDesksQuerySchema = paginationQuerySchema.extend({
  spaceId: z.string().optional(),
});

export function registerDeskRoutes(app: FastifyInstance): void {
  const service = new DeskService(app.repos.desks, app.repos.spaces, app.services.billing);

  app.register(async (scoped) => {
    scoped.addHook('preHandler', app.authHook);
    scoped.addHook('preHandler', tenantMiddleware);

    scoped.post(
      '/desks',
      { preHandler: requireRole('owner', 'admin', 'manager') },
      async (request, reply) => {
        const body = createDeskSchema.parse(request.body);
        reply
          .status(201)
          .send({ data: throwIfError(await service.create(request.tenantId, body)) });
      },
    );

    scoped.get('/desks', async (request, reply) => {
      const query = listDesksQuerySchema.parse(request.query);
      reply.send({ data: await service.list(request.tenantId, query) });
    });

    scoped.get('/desks/:deskId', async (request, reply) => {
      const { deskId } = deskIdParamSchema.parse(request.params);
      reply.send({ data: throwIfError(await service.getById(request.tenantId, deskId)) });
    });

    scoped.patch(
      '/desks/:deskId',
      { preHandler: requireRole('owner', 'admin', 'manager') },
      async (request, reply) => {
        const { deskId } = deskIdParamSchema.parse(request.params);
        const body = updateDeskSchema.parse(request.body);
        reply.send({ data: throwIfError(await service.update(request.tenantId, deskId, body)) });
      },
    );

    scoped.delete(
      '/desks/:deskId',
      { preHandler: requireRole('owner', 'admin') },
      async (request, reply) => {
        const { deskId } = deskIdParamSchema.parse(request.params);
        throwIfError(await service.delete(request.tenantId, deskId));
        reply.status(204).send();
      },
    );
  });
}
