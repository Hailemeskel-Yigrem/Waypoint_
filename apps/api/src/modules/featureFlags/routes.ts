import type { FastifyInstance } from 'fastify';
import { FeatureFlagService, MemoryFeatureFlagRepository, createFeatureFlagSchema, featureFlagsFilterSchema } from '@waypoint/domain';

export async function featureFlagsRoutes(app: FastifyInstance): Promise<void> {
  const service = new FeatureFlagService(new MemoryFeatureFlagRepository());

  app.get('/featureFlags', async (req) => {
    const filter = featureFlagsFilterSchema.parse(req.query);
    const result = await service.list(filter);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.post('/featureFlags', async (req) => {
    const body = createFeatureFlagSchema.parse(req.body);
    const result = await service.create(body);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.get('/featureFlags/:id', async (req) => {
    const params = req.params as { id: string };
    const query = req.query as { organizationId: string };
    const result = await service.get(query.organizationId, params.id);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });
}
