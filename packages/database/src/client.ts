import pg from 'pg';

export type QueryResult<T> = { rows: T[]; rowCount: number };

export interface DatabaseClient {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;
  close(): Promise<void>;
}

export function createPool(connectionString: string): pg.Pool {
  return new pg.Pool({ connectionString, max: 20, idleTimeoutMillis: 30000 });
}

export function poolToClient(pool: pg.Pool): DatabaseClient {
  return {
    async query<T = Record<string, unknown>>(sql: string, params?: unknown[]) {
      const result = await pool.query(sql, params);
      return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 };
    },
    close: () => pool.end(),
  };
}
