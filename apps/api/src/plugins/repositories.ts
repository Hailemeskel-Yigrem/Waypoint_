import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import type { Repositories } from '../modules/index.js';

declare module 'fastify' {
  interface FastifyInstance {
    repos: Repositories;
  }
}

export const repositoriesPlugin = fp(async (app: FastifyInstance, repos: Repositories) => {
  app.decorate('repos', repos);
});
