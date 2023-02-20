import Fastify, { type FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { loadConfig } from './config/index.js';
import { createLogger } from './lib/logger.js';
import { createErrorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { createAuthMiddleware } from './middleware/auth.js';
import { registerRateLimit } from './middleware/rateLimit.js';
import { configPlugin } from './plugins/config.js';
import { databasePlugin } from './plugins/database.js';
import { repositoriesPlugin } from './plugins/repositories.js';
import {
  createMemoryRepositories,
  wireRepositories,
  createServices,
  createDispatchers,
  type Repositories,
  type Services,
  type Dispatchers,
} from './modules/index.js';
import { registerRoutes } from './routes.js';

declare module 'fastify' {
  interface FastifyInstance {
    authHook: ReturnType<typeof createAuthMiddleware>;
    services: Services;
    dispatchers: Dispatchers;
  }
}

export interface AppOptions {
  repos?: Repositories;
  config?: ReturnType<typeof loadConfig>;
}

export async function buildApp(options: AppOptions = {}): Promise<FastifyInstance> {
  const config = options.config ?? loadConfig();
  const logger = createLogger({ level: config.LOG_LEVEL, pretty: config.LOG_PRETTY ?? config.NODE_ENV === 'development' });

  const app = Fastify({
    logger: false,
    requestIdHeader: 'x-request-id',
    genReqId: () => randomUUID(),
  });

  app.log = logger;

  await app.register(configPlugin, config);
  await app.register(databasePlugin);
  await app.register(cors, { origin: config.CORS_ORIGIN === '*' ? true : config.CORS_ORIGIN.split(',') });
  await app.register(helmet, { contentSecurityPolicy: false });
  await registerRateLimit(app, { max: config.RATE_LIMIT_MAX, timeWindow: config.RATE_LIMIT_WINDOW_MS });

  const repos = wireRepositories(options.repos ?? createMemoryRepositories());
  await app.register(repositoriesPlugin, repos);

  const services = createServices(repos);
  const dispatchers = createDispatchers();
  app.decorate('services', services);
  app.decorate('dispatchers', dispatchers);

  const authHook = createAuthMiddleware({
    jwtSecret: config.JWT_SECRET,
    apiKeySalt: config.API_KEY_SALT,
    userRepo: repos.users,
  });
  app.decorate('authHook', authHook);

  app.addHook('onRequest', requestIdMiddleware);
  app.setErrorHandler(createErrorHandler(logger));
  app.setNotFoundHandler(notFoundHandler);

  registerRoutes(app);

  return app;
}
