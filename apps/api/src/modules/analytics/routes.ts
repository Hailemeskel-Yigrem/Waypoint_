import type { FastifyInstance } from 'fastify';
import { analyticsRangeSchema } from './schema.js';
import { throwIfError } from '../../middleware/errorHandler.js';
import { tenantMiddleware } from '../../middleware/tenant.js';

export function registerAnalyticsRoutes(app: FastifyInstance): void {
  const service = app.services.analytics;

  app.register(async (scoped) => {
    scoped.addHook('preHandler', app.authHook);
    scoped.addHook('preHandler', tenantMiddleware);

    scoped.get('/analytics/dashboard', async (request, reply) => {
      const { from, to } = analyticsRangeSchema.parse(request.query);
      reply.send({ data: throwIfError(await service.dashboard(request.tenantId, from, to)) });
    });

    scoped.get('/analytics/occupancy', async (request, reply) => {
      const { from, to } = analyticsRangeSchema.parse(request.query);
      reply.send({ data: throwIfError(await service.occupancy(request.tenantId, from, to)) });
    });

    scoped.get('/analytics/visitors', async (request, reply) => {
      const { from, to } = analyticsRangeSchema.parse(request.query);
      reply.send({ data: throwIfError(await service.visitors(request.tenantId, from, to)) });
    });

    scoped.get('/analytics/bookings', async (request, reply) => {
      const { from, to } = analyticsRangeSchema.parse(request.query);
      reply.send({ data: throwIfError(await service.bookings(request.tenantId, from, to)) });
    });
  });
}
