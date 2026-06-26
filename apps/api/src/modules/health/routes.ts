import type { FastifyInstance } from 'fastify';
import { healthQuerySchema } from './schema.js';
import { apiMetrics } from './metrics.js';

export function registerHealthRoutes(app: FastifyInstance): void {
  const service = app.services.health;

  app.get('/health', async (_request, reply) => {
    reply.send({ data: await service.liveness() });
  });

  app.get('/health/ready', async (request, reply) => {
    const { verbose } = healthQuerySchema.parse(request.query);
    const status = await service.readiness(verbose);
    reply.status(status.ready ? 200 : 503).send({ data: status });
  });

  app.get('/metrics', async (_request, reply) => {
    reply.type('text/plain; version=0.0.4; charset=utf-8').send(apiMetrics.render());
  });
}
