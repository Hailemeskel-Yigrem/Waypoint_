import type { FastifyInstance } from 'fastify';
import { AmenityService } from './service.js';
import { createAmenitySchema, createReservationSchema, amenityIdParamSchema } from './schema.js';
import { paginationQuerySchema } from '../../lib/pagination.js';
import { throwIfError } from '../../middleware/errorHandler.js';
import { requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';

export function registerAmenityRoutes(app: FastifyInstance): void {
  const service = new AmenityService(app.repos.amenities, app.repos.spaces);

  app.register(async (scoped) => {
    scoped.addHook('preHandler', app.authHook);
    scoped.addHook('preHandler', tenantMiddleware);

    scoped.post('/amenities', { preHandler: requireRole('owner', 'admin', 'manager') }, async (request, reply) => {
      const body = createAmenitySchema.parse(request.body);
      reply.status(201).send({ data: throwIfError(await service.create(request.tenantId, body)) });
    });

    scoped.get('/amenities', async (request, reply) => {
      const query = paginationQuerySchema.parse(request.query);
      reply.send({ data: await service.list(request.tenantId, query) });
    });

    scoped.get('/amenities/:amenityId', async (request, reply) => {
      const { amenityId } = amenityIdParamSchema.parse(request.params);
      reply.send({ data: throwIfError(await service.getById(request.tenantId, amenityId)) });
    });

    scoped.post('/amenities/reservations', async (request, reply) => {
      const body = createReservationSchema.parse(request.body);
      reply.status(201).send({
        data: throwIfError(await service.reserve(request.tenantId, request.auth!.userId, body)),
      });
    });
  });
}
