import type { FastifyInstance } from 'fastify';
import {
  PolicyService,
  MemoryPolicyRepository,
  createPolicySchema,
  policiesFilterSchema,
} from '@waypoint/domain';

export async function policiesRoutes(app: FastifyInstance): Promise<void> {
  const service = new PolicyService(new MemoryPolicyRepository());

  app.get('/policies', async (req) => {
    const filter = policiesFilterSchema.parse(req.query);
    const result = await service.list(filter);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.post('/policies', async (req) => {
    const body = createPolicySchema.parse(req.body);
    const result = await service.create(body);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.get('/policies/:id', async (req) => {
    const params = req.params as { id: string };
    const query = req.query as { organizationId: string };
    const result = await service.get(query.organizationId, params.id);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });
}
