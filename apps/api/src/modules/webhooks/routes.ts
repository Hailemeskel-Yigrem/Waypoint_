import type { FastifyInstance } from 'fastify';
import {
  WebhookService,
  MemoryWebhookRepository,
  createWebhookSchema,
  webhooksFilterSchema,
} from '@waypoint/domain';

export async function webhooksRoutes(app: FastifyInstance): Promise<void> {
  const service = new WebhookService(new MemoryWebhookRepository());

  app.get('/webhooks', async (req) => {
    const filter = webhooksFilterSchema.parse(req.query);
    const result = await service.list(filter);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.post('/webhooks', async (req) => {
    const body = createWebhookSchema.parse(req.body);
    const result = await service.create(body);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.get('/webhooks/:id', async (req) => {
    const params = req.params as { id: string };
    const query = req.query as { organizationId: string };
    const result = await service.get(query.organizationId, params.id);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });
}
