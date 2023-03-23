import type { FastifyInstance } from 'fastify';
import { UserService } from './service.js';
import { createUserSchema, updateUserSchema, loginSchema, userIdParamSchema } from './schema.js';
import { paginationQuerySchema } from '../../lib/pagination.js';
import { throwIfError } from '../../middleware/errorHandler.js';
import { requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';

export function registerUserRoutes(app: FastifyInstance): void {
  const service = new UserService(
    app.repos.users,
    app.services.billing,
    app.config.JWT_SECRET,
    app.config.API_KEY_SALT,
  );

  app.post('/auth/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const result = await service.login(body);
    reply.send({ data: throwIfError(result) });
  });

  app.register(async (scoped) => {
    scoped.addHook('preHandler', app.authHook);
    scoped.addHook('preHandler', tenantMiddleware);

    scoped.post('/users', { preHandler: requireRole('owner', 'admin') }, async (request, reply) => {
      const body = createUserSchema.parse(request.body);
      const result = await service.create(request.tenantId, body);
      reply.status(201).send({ data: throwIfError(result) });
    });

    scoped.get('/users', async (request, reply) => {
      const query = paginationQuerySchema.parse(request.query);
      const result = await service.list(request.tenantId, query);
      reply.send({ data: result });
    });

    scoped.get('/users/:userId', async (request, reply) => {
      const { userId } = userIdParamSchema.parse(request.params);
      const result = await service.getById(request.tenantId, userId);
      reply.send({ data: throwIfError(result) });
    });

    scoped.patch(
      '/users/:userId',
      { preHandler: requireRole('owner', 'admin') },
      async (request, reply) => {
        const { userId } = userIdParamSchema.parse(request.params);
        const body = updateUserSchema.parse(request.body);
        const result = await service.update(request.tenantId, userId, body);
        reply.send({ data: throwIfError(result) });
      },
    );

    scoped.delete(
      '/users/:userId',
      { preHandler: requireRole('owner', 'admin') },
      async (request, reply) => {
        const { userId } = userIdParamSchema.parse(request.params);
        throwIfError(await service.delete(request.tenantId, userId));
        reply.status(204).send();
      },
    );

    scoped.post(
      '/users/:userId/api-key',
      { preHandler: requireRole('owner', 'admin') },
      async (request, reply) => {
        const { userId } = userIdParamSchema.parse(request.params);
        const result = await service.generateApiKey(request.tenantId, userId);
        reply.send({ data: throwIfError(result) });
      },
    );
  });
}
