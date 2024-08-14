import { describe, it, expect } from 'vitest';
import { buildUtilizationReport, explainUtilization } from './engine.js';

describe('report engine', () => {
  it('builds utilization summary', () => {
    const summary = buildUtilizationReport([
      { organizationId: 'o', label: 'A', value: 10, sampleSize: 2 },
      { organizationId: 'o', label: 'B', value: 30, sampleSize: 2 },
    ]);
    expect(summary.average).toBe(20);
    expect(explainUtilization(summary).length).toBeGreaterThan(0);
  });
});
