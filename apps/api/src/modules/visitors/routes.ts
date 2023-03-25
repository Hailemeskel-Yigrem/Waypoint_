import type { FastifyInstance } from 'fastify';
import { VisitorService } from './service.js';
import { createVisitorSchema, visitorIdParamSchema } from './schema.js';
import { paginationQuerySchema } from '../../lib/pagination.js';
import { z } from 'zod';
import { throwIfError } from '../../middleware/errorHandler.js';
import { tenantMiddleware } from '../../middleware/tenant.js';

const listVisitorsQuerySchema = paginationQuerySchema.extend({
  hostUserId: z.string().optional(),
  status: z.string().optional(),
});

export function registerVisitorRoutes(app: FastifyInstance): void {
  const service = new VisitorService(app.repos.visitors, app.repos.users, app.repos.organizations);

  app.register(async (scoped) => {
    scoped.addHook('preHandler', app.authHook);
    scoped.addHook('preHandler', tenantMiddleware);

    scoped.post('/visitors', async (request, reply) => {
      const body = createVisitorSchema.parse(request.body);
      reply.status(201).send({ data: throwIfError(await service.create(request.tenantId, body)) });
    });

    scoped.get('/visitors', async (request, reply) => {
      const query = listVisitorsQuerySchema.parse(request.query);
      reply.send({ data: await service.list(request.tenantId, query) });
    });

    scoped.get('/visitors/:visitorId', async (request, reply) => {
      const { visitorId } = visitorIdParamSchema.parse(request.params);
      reply.send({ data: throwIfError(await service.getById(request.tenantId, visitorId)) });
    });

    scoped.post('/visitors/:visitorId/check-in', async (request, reply) => {
      const { visitorId } = visitorIdParamSchema.parse(request.params);
      reply.send({ data: throwIfError(await service.checkIn(request.tenantId, visitorId)) });
    });

    scoped.post('/visitors/:visitorId/check-out', async (request, reply) => {
      const { visitorId } = visitorIdParamSchema.parse(request.params);
      reply.send({ data: throwIfError(await service.checkOut(request.tenantId, visitorId)) });
    });
  });
}
