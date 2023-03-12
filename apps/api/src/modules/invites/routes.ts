import type { FastifyInstance } from 'fastify';
import {
  InviteService,
  MemoryInviteRepository,
  createInviteSchema,
  invitesFilterSchema,
} from '@waypoint/domain';

export async function invitesRoutes(app: FastifyInstance): Promise<void> {
  const service = new InviteService(new MemoryInviteRepository());

  app.get('/invites', async (req) => {
    const filter = invitesFilterSchema.parse(req.query);
    const result = await service.list(filter);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.post('/invites', async (req) => {
    const body = createInviteSchema.parse(req.body);
    const result = await service.create(body);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.get('/invites/:id', async (req) => {
    const params = req.params as { id: string };
    const query = req.query as { organizationId: string };
    const result = await service.get(query.organizationId, params.id);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });
}
