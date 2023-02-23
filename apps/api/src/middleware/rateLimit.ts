import type { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';

export async function registerRateLimit(
  app: FastifyInstance,
  options: { max: number; timeWindow: number },
): Promise<void> {
  await app.register(rateLimit, {
    max: options.max,
    timeWindow: options.timeWindow,
    keyGenerator: (request) => {
      const auth = request.auth;
      if (auth) {
        return `user:${auth.userId}`;
      }
      return request.ip;
    },
    errorResponseBuilder: (_request, context) => ({
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests',
        details: {
          limit: context.max,
          retryAfter: context.after,
        },
      },
    }),
  });
}
