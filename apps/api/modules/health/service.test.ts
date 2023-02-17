import { describe, it, expect } from 'vitest';
import { HealthService } from '../../src/modules/health/service.js';
import { MemoryHealthRepository } from '../../src/modules/health/memory.repository.js';

describe('HealthService', () => {
  it('returns liveness status', async () => {
    const service = new HealthService(new MemoryHealthRepository(false));
    const status = await service.liveness();
    expect(status.status).toBe('ok');
    expect(status.version).toBeDefined();
  });

  it('returns readiness with db check', async () => {
    const service = new HealthService(new MemoryHealthRepository(false));
    const status = await service.readiness(true);
    expect(status.ready).toBe(true);
  });
});

