import type { FastifyInstance } from 'fastify';
import { updateSubscriptionSchema } from './schema.js';
import { throwIfError } from '../../middleware/errorHandler.js';
import { requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';

export function registerBillingRoutes(app: FastifyInstance): void {
  const service = app.services.billing;

  app.register(async (scoped) => {
    scoped.addHook('preHandler', app.authHook);
    scoped.addHook('preHandler', tenantMiddleware);

    scoped.get('/billing/subscription', async (request, reply) => {
      reply.send({ data: throwIfError(await service.getSubscription(request.tenantId)) });
    });

    scoped.get('/billing/usage', async (request, reply) => {
      reply.send({ data: await service.getUsage(request.tenantId) });
    });

    scoped.patch('/billing/subscription', { preHandler: requireRole('owner') }, async (request, reply) => {
      const body = updateSubscriptionSchema.parse(request.body);
      if (!body.plan) throw new Error('plan required');
      reply.send({ data: throwIfError(await service.updatePlan(request.tenantId, body.plan)) });
    });
  });
}

