import type { FastifyInstance } from 'fastify';
import { NotificationService } from './service.js';
import { createNotificationSchema, notificationIdParamSchema } from './schema.js';
import { paginationQuerySchema } from '../../lib/pagination.js';
import { throwIfError } from '../../middleware/errorHandler.js';
import { requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';

export function registerNotificationRoutes(app: FastifyInstance): void {
  const service = new NotificationService(
    app.repos.notifications,
    app.dispatchers.notifications,
    app.repos.users,
  );

  app.register(async (scoped) => {
    scoped.addHook('preHandler', app.authHook);
    scoped.addHook('preHandler', tenantMiddleware);

    scoped.post(
      '/notifications',
      { preHandler: requireRole('owner', 'admin', 'manager') },
      async (request, reply) => {
        const body = createNotificationSchema.parse(request.body);
        reply.status(201).send({ data: throwIfError(await service.send(request.tenantId, body)) });
      },
    );

    scoped.get('/notifications/me', async (request, reply) => {
      const query = paginationQuerySchema.parse(request.query);
      reply.send({
        data: await service.listForUser(request.tenantId, request.auth!.userId, query),
      });
    });

    scoped.post('/notifications/:notificationId/read', async (request, reply) => {
      const { notificationId } = notificationIdParamSchema.parse(request.params);
      reply.send({
        data: throwIfError(
          await service.markRead(request.tenantId, request.auth!.userId, notificationId),
        ),
      });
    });
  });
}
