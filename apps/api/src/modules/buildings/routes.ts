import type { FastifyInstance } from 'fastify';
import { BuildingService, MemoryBuildingRepository, createBuildingSchema, buildingsFilterSchema } from '@waypoint/domain';

export async function buildingsRoutes(app: FastifyInstance): Promise<void> {
  const service = new BuildingService(new MemoryBuildingRepository());

  app.get('/buildings', async (req) => {
    const filter = buildingsFilterSchema.parse(req.query);
    const result = await service.list(filter);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.post('/buildings', async (req) => {
    const body = createBuildingSchema.parse(req.body);
    const result = await service.create(body);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.get('/buildings/:id', async (req) => {
    const params = req.params as { id: string };
    const query = req.query as { organizationId: string };
    const result = await service.get(query.organizationId, params.id);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });
}
