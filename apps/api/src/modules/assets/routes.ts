import type { FastifyInstance } from 'fastify';
import { AssetService, MemoryAssetRepository, createAssetSchema, assetsFilterSchema } from '@waypoint/domain';

export async function assetsRoutes(app: FastifyInstance): Promise<void> {
  const service = new AssetService(new MemoryAssetRepository());

  app.get('/assets', async (req) => {
    const filter = assetsFilterSchema.parse(req.query);
    const result = await service.list(filter);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.post('/assets', async (req) => {
    const body = createAssetSchema.parse(req.body);
    const result = await service.create(body);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.get('/assets/:id', async (req) => {
    const params = req.params as { id: string };
    const query = req.query as { organizationId: string };
    const result = await service.get(query.organizationId, params.id);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });
}
