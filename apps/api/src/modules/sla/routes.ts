import type { FastifyInstance } from 'fastify';
import {
  SlaTargetService,
  MemorySlaTargetRepository,
  createSlaTargetSchema,
  slaFilterSchema,
} from '@waypoint/domain';

export async function slaRoutes(app: FastifyInstance): Promise<void> {
  const service = new SlaTargetService(new MemorySlaTargetRepository());

  app.get('/sla', async (req) => {
    const filter = slaFilterSchema.parse(req.query);
    const result = await service.list(filter);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.post('/sla', async (req) => {
    const body = createSlaTargetSchema.parse(req.body);
    const result = await service.create(body);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.get('/sla/:id', async (req) => {
    const params = req.params as { id: string };
    const query = req.query as { organizationId: string };
    const result = await service.get(query.organizationId, params.id);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });
}
