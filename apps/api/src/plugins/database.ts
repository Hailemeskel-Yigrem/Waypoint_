import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import type { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { Pool as PgPool } from 'pg';

export interface DatabaseClient {
  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>>;
  withTransaction<T>(fn: (client: DatabaseClient) => Promise<T>): Promise<T>;
}

class PgDatabaseClient implements DatabaseClient {
  constructor(private readonly client: Pool | PoolClient) {}

  async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>> {
    return this.client.query<T>(text, params);
  }

  async withTransaction<T>(fn: (client: DatabaseClient) => Promise<T>): Promise<T> {
    if (!(this.client instanceof PgPool)) {
      return fn(this);
    }

    const poolClient = await this.client.connect();
    try {
      await poolClient.query('BEGIN');
      const result = await fn(new PgDatabaseClient(poolClient));
      await poolClient.query('COMMIT');
      return result;
    } catch (e) {
      await poolClient.query('ROLLBACK');
      throw e;
    } finally {
      poolClient.release();
    }
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    db: DatabaseClient | null;
  }
}

export const databasePlugin = fp(async (app: FastifyInstance) => {
  const connectionString = app.config.DATABASE_URL;

  if (!connectionString || app.config.USE_MEMORY_REPOS) {
    app.decorate('db', null);
    app.log.info('Using in-memory repositories (no database connection)');
    return;
  }

  const pool = new PgPool({ connectionString, max: 20 });
  pool.on('error', (err) => {
    app.log.error({ err }, 'Unexpected database pool error');
  });

  const db = new PgDatabaseClient(pool);
  await db.query('SELECT 1');
  app.decorate('db', db);

  app.addHook('onClose', async () => {
    await pool.end();
  });

  app.log.info('PostgreSQL connection established');
});

export { PgDatabaseClient };
