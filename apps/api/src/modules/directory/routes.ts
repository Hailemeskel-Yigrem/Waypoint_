import type { FastifyInstance } from 'fastify';
import { DirectoryService } from './service.js';
import {
  createDirectoryEntrySchema,
  updateDirectoryEntrySchema,
  directorySearchSchema,
  directoryEntryIdParamSchema,
} from './schema.js';
import { paginationQuerySchema } from '../../lib/pagination.js';
import { throwIfError } from '../../middleware/errorHandler.js';
import { requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';

export function registerDirectoryRoutes(app: FastifyInstance): void {
  const service = new DirectoryService(app.repos.directory);

  app.register(async (scoped) => {
    scoped.addHook('preHandler', app.authHook);
    scoped.addHook('preHandler', tenantMiddleware);

    scoped.post(
      '/directory',
      { preHandler: requireRole('owner', 'admin') },
      async (request, reply) => {
        const body = createDirectoryEntrySchema.parse(request.body);
        reply
          .status(201)
          .send({ data: throwIfError(await service.create(request.tenantId, body)) });
      },
    );

    scoped.get('/directory', async (request, reply) => {
      const query = {
        ...paginationQuerySchema.parse(request.query),
        ...directorySearchSchema.parse(request.query),
      };
      reply.send({ data: await service.search(request.tenantId, query) });
    });

    scoped.get('/directory/:entryId', async (request, reply) => {
      const { entryId } = directoryEntryIdParamSchema.parse(request.params);
      reply.send({ data: throwIfError(await service.getById(request.tenantId, entryId)) });
    });

    scoped.patch(
      '/directory/:entryId',
      { preHandler: requireRole('owner', 'admin') },
      async (request, reply) => {
        const { entryId } = directoryEntryIdParamSchema.parse(request.params);
        const body = updateDirectoryEntrySchema.parse(request.body);
        reply.send({ data: throwIfError(await service.update(request.tenantId, entryId, body)) });
      },
    );

    scoped.delete(
      '/directory/:entryId',
      { preHandler: requireRole('owner', 'admin') },
      async (request, reply) => {
        const { entryId } = directoryEntryIdParamSchema.parse(request.params);
        throwIfError(await service.delete(request.tenantId, entryId));
        reply.status(204).send();
      },
    );
  });
}
