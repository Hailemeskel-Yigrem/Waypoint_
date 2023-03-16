import type { FastifyInstance } from 'fastify';
import { OrganizationService } from './service.js';
import {
  createOrganizationSchema,
  updateOrganizationSchema,
  organizationIdParamSchema,
} from './schema.js';
import { paginationQuerySchema } from '../../lib/pagination.js';
import { throwIfError } from '../../middleware/errorHandler.js';

export function registerOrganizationRoutes(app: FastifyInstance): void {
  const service = new OrganizationService(app.repos.organizations);

  app.post('/organizations', async (request, reply) => {
    const body = createOrganizationSchema.parse(request.body);
    const result = await service.create(body);
    const org = throwIfError(result);
    reply.status(201).send({ data: org });
  });

  app.get('/organizations', async (request, reply) => {
    const query = paginationQuerySchema.parse(request.query);
    const result = await service.list(query);
    reply.send({ data: result });
  });

  app.get('/organizations/:organizationId', async (request, reply) => {
    const { organizationId } = organizationIdParamSchema.parse(request.params);
    const result = await service.getById(organizationId);
    reply.send({ data: throwIfError(result) });
  });

  app.patch('/organizations/:organizationId', async (request, reply) => {
    const { organizationId } = organizationIdParamSchema.parse(request.params);
    const body = updateOrganizationSchema.parse(request.body);
    const result = await service.update(organizationId, body);
    reply.send({ data: throwIfError(result) });
  });

  app.delete('/organizations/:organizationId', async (request, reply) => {
    const { organizationId } = organizationIdParamSchema.parse(request.params);
    throwIfError(await service.delete(organizationId));
    reply.status(204).send();
  });
}
