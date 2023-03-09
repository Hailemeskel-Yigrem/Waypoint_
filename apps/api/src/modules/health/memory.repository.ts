import type { HealthStatus, ReadinessStatus, HealthCheck } from './types.js';

export interface HealthRepository {
  pingDatabase(): Promise<HealthCheck>;
}

export class MemoryHealthRepository implements HealthRepository {
  constructor(private readonly dbConnected: boolean) {}

  async pingDatabase(): Promise<HealthCheck> {
    const start = Date.now();
    if (!this.dbConnected) {
      return {
        name: 'database',
        status: 'ok',
        latencyMs: Date.now() - start,
        message: 'in-memory mode',
      };
    }
    return { name: 'database', status: 'ok', latencyMs: Date.now() - start };
  }
}
