import type { FastifyInstance } from 'fastify';
import {
  TeamService,
  MemoryTeamRepository,
  createTeamSchema,
  teamsFilterSchema,
} from '@waypoint/domain';

export async function teamsRoutes(app: FastifyInstance): Promise<void> {
  const service = new TeamService(new MemoryTeamRepository());

  app.get('/teams', async (req) => {
    const filter = teamsFilterSchema.parse(req.query);
    const result = await service.list(filter);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.post('/teams', async (req) => {
    const body = createTeamSchema.parse(req.body);
    const result = await service.create(body);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });

  app.get('/teams/:id', async (req) => {
    const params = req.params as { id: string };
    const query = req.query as { organizationId: string };
    const result = await service.get(query.organizationId, params.id);
    if (!result.ok) throw result.error;
    return { data: result.value };
  });
}
