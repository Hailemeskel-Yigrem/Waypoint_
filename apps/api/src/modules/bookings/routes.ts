import type { FastifyInstance } from 'fastify';
import { BookingService } from './service.js';
import { createBookingSchema, updateBookingSchema, bookingIdParamSchema } from './schema.js';
import { paginationQuerySchema } from '../../lib/pagination.js';
import { z } from 'zod';
import { throwIfError } from '../../middleware/errorHandler.js';
import { tenantMiddleware } from '../../middleware/tenant.js';

const listBookingsQuerySchema = paginationQuerySchema.extend({
  userId: z.string().optional(),
  deskId: z.string().optional(),
  spaceId: z.string().optional(),
});

export function registerBookingRoutes(app: FastifyInstance): void {
  const service = new BookingService(
    app.repos.bookings,
    app.repos.desks,
    app.repos.spaces,
    app.services.billing,
    app.services.access,
  );

  app.register(async (scoped) => {
    scoped.addHook('preHandler', app.authHook);
    scoped.addHook('preHandler', tenantMiddleware);

    scoped.post('/bookings', async (request, reply) => {
      const body = createBookingSchema.parse(request.body);
      const result = await service.create(request.tenantId, request.auth!.userId, body);
      reply.status(201).send({ data: throwIfError(result) });
    });

    scoped.get('/bookings', async (request, reply) => {
      const query = listBookingsQuerySchema.parse(request.query);
      reply.send({ data: await service.list(request.tenantId, query) });
    });

    scoped.get('/bookings/:bookingId', async (request, reply) => {
      const { bookingId } = bookingIdParamSchema.parse(request.params);
      reply.send({ data: throwIfError(await service.getById(request.tenantId, bookingId)) });
    });

    scoped.patch('/bookings/:bookingId', async (request, reply) => {
      const { bookingId } = bookingIdParamSchema.parse(request.params);
      const body = updateBookingSchema.parse(request.body);
      reply.send({ data: throwIfError(await service.update(request.tenantId, bookingId, body)) });
    });

    scoped.post('/bookings/:bookingId/cancel', async (request, reply) => {
      const { bookingId } = bookingIdParamSchema.parse(request.params);
      reply.send({ data: throwIfError(await service.cancel(request.tenantId, bookingId)) });
    });

    scoped.post('/bookings/:bookingId/check-in', async (request, reply) => {
      const { bookingId } = bookingIdParamSchema.parse(request.params);
      reply.send({ data: throwIfError(await service.checkIn(request.tenantId, bookingId)) });
    });
  });
}
