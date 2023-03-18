import type { FastifyInstance } from 'fastify';
import {
  ShiftService,
  MemoryShiftRepository,
  createShiftSchema,
  shiftsFilterSchema,
} from '@waypoint/domain';

export async function shiftsRoutes(app: FastifyInstance): Promise<void> {
  const service = new ShiftService(new MemoryShiftRepository());

  app.get('/shifts', async (req) => {
    const filter = shiftsFilterSchema.parse(req.query);
    const result = await service.list(filter);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.post('/shifts', async (req) => {
    const body = createShiftSchema.parse(req.body);
    const result = await service.create(body);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.get('/shifts/:id', async (req) => {
    const params = req.params as { id: string };
    const query = req.query as { organizationId: string };
    const result = await service.get(query.organizationId, params.id);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });
}
