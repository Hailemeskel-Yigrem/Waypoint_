import type { FastifyInstance } from 'fastify';
import {
  AuditEventService,
  MemoryAuditEventRepository,
  createAuditEventSchema,
  auditFilterSchema,
} from '@waypoint/domain';

export async function auditRoutes(app: FastifyInstance): Promise<void> {
  const service = new AuditEventService(new MemoryAuditEventRepository());

  app.get('/audit', async (req) => {
    const filter = auditFilterSchema.parse(req.query);
    const result = await service.list(filter);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.post('/audit', async (req) => {
    const body = createAuditEventSchema.parse(req.body);
    const result = await service.create(body);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.get('/audit/:id', async (req) => {
    const params = req.params as { id: string };
    const query = req.query as { organizationId: string };
    const result = await service.get(query.organizationId, params.id);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });
}
