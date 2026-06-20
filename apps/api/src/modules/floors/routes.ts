import type { FastifyInstance } from 'fastify';
import {
  FloorService,
  MemoryFloorRepository,
  createFloorSchema,
  floorsFilterSchema,
} from '@waypoint/domain';

export async function floorsRoutes(app: FastifyInstance): Promise<void> {
  const service = new FloorService(new MemoryFloorRepository());

  app.get('/floors', async (req) => {
    const filter = floorsFilterSchema.parse(req.query);
    const result = await service.list(filter);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.post('/floors', async (req) => {
    const body = createFloorSchema.parse(req.body);
    const result = await service.create(body);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.get('/floors/:id', async (req) => {
    const params = req.params as { id: string };
    const query = req.query as { organizationId: string };
    const result = await service.get(query.organizationId, params.id);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });
}
