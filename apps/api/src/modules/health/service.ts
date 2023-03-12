import type { HealthRepository } from './memory.repository.js';
import type { HealthStatus, ReadinessStatus } from './types.js';

const VERSION = '0.1.0';
const startedAt = Date.now();

export class HealthService {
  constructor(private readonly repo: HealthRepository) {}

  async liveness(): Promise<HealthStatus> {
    return {
      status: 'ok',
      version: VERSION,
      uptime: Math.floor((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString(),
      checks: [],
    };
  }

  async readiness(verbose = false): Promise<ReadinessStatus & Partial<HealthStatus>> {
    const dbCheck = await this.repo.pingDatabase();
    const checks = [dbCheck];
    const ready = checks.every((c) => c.status !== 'down');
    const base: ReadinessStatus = { ready, checks };

    if (!verbose) return base;

    return {
      ...base,
      status: ready ? 'ok' : 'degraded',
      version: VERSION,
      uptime: Math.floor((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString(),
    };
  }
}
