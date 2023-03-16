import type { FastifyInstance } from 'fastify';
import {
  ReportService,
  MemoryReportRepository,
  createReportSchema,
  reportsFilterSchema,
} from '@waypoint/domain';

export async function reportsRoutes(app: FastifyInstance): Promise<void> {
  const service = new ReportService(new MemoryReportRepository());

  app.get('/reports', async (req) => {
    const filter = reportsFilterSchema.parse(req.query);
    const result = await service.list(filter);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.post('/reports', async (req) => {
    const body = createReportSchema.parse(req.body);
    const result = await service.create(body);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.get('/reports/:id', async (req) => {
    const params = req.params as { id: string };
    const query = req.query as { organizationId: string };
    const result = await service.get(query.organizationId, params.id);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });
}
