import type { FastifyInstance } from 'fastify';
import {
  ZoneService,
  MemoryZoneRepository,
  createZoneSchema,
  zonesFilterSchema,
} from '@waypoint/domain';

export async function zonesRoutes(app: FastifyInstance): Promise<void> {
  const service = new ZoneService(new MemoryZoneRepository());

  app.get('/zones', async (req) => {
    const filter = zonesFilterSchema.parse(req.query);
    const result = await service.list(filter);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.post('/zones', async (req) => {
    const body = createZoneSchema.parse(req.body);
    const result = await service.create(body);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.get('/zones/:id', async (req) => {
    const params = req.params as { id: string };
    const query = req.query as { organizationId: string };
    const result = await service.get(query.organizationId, params.id);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });
}
