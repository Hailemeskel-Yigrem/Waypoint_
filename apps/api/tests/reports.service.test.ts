import { describe, it, expect } from 'vitest';
import { ReportService, MemoryReportRepository } from '@waypoint/domain';

describe('api reports wiring', () => {
  it('creates via domain service', async () => {
    const service = new ReportService(new MemoryReportRepository());
    const result = await service.create({
      organizationId: '11111111-1111-1111-1111-111111111111',
      name: 'API Report',
    });
    expect(result.ok).toBe(true);
  });
});
