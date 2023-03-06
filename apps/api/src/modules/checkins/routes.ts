import type { FastifyInstance } from 'fastify';
import { CheckInService, MemoryCheckInRepository, createCheckInSchema, checkinsFilterSchema } from '@waypoint/domain';

export async function checkinsRoutes(app: FastifyInstance): Promise<void> {
  const service = new CheckInService(new MemoryCheckInRepository());

  app.get('/checkins', async (req) => {
    const filter = checkinsFilterSchema.parse(req.query);
    const result = await service.list(filter);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.post('/checkins', async (req) => {
    const body = createCheckInSchema.parse(req.body);
    const result = await service.create(body);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.get('/checkins/:id', async (req) => {
    const params = req.params as { id: string };
    const query = req.query as { organizationId: string };
    const result = await service.get(query.organizationId, params.id);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });
}
