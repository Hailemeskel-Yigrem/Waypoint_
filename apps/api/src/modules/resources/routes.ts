import type { FastifyInstance } from 'fastify';
import {
  ResourceService,
  MemoryResourceRepository,
  createResourceSchema,
  resourcesFilterSchema,
} from '@waypoint/domain';

export async function resourcesRoutes(app: FastifyInstance): Promise<void> {
  const service = new ResourceService(new MemoryResourceRepository());

  app.get('/resources', async (req) => {
    const filter = resourcesFilterSchema.parse(req.query);
    const result = await service.list(filter);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.post('/resources', async (req) => {
    const body = createResourceSchema.parse(req.body);
    const result = await service.create(body);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.get('/resources/:id', async (req) => {
    const params = req.params as { id: string };
    const query = req.query as { organizationId: string };
    const result = await service.get(query.organizationId, params.id);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });
}
