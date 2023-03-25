import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import type { Env } from '../config/index.js';

declare module 'fastify' {
  interface FastifyInstance {
    config: Env;
  }
}

export const configPlugin = fp(async (app: FastifyInstance, config: Env) => {
  app.decorate('config', config);
});
