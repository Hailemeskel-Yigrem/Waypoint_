import { describe, expect, it } from 'vitest';
import {
  buildNoShowsReport,
  buildUtilizationReport,
  explainUtilization,
  normalizeUtilization,
} from './engine.js';

describe('report engine', () => {
  it('builds a sorted utilization summary without mutating input', () => {
    const rows = [
      { organizationId: 'org-1', label: 'A', value: 10, sampleSize: 2 },
      { organizationId: 'org-1', label: 'B', value: 30, sampleSize: 2 },
    ];
    const summary = buildUtilizationReport(rows);

    expect(summary).toMatchObject({ total: 40, average: 20, min: 10, max: 30 });
    expect(summary.top.map((row) => row.label)).toEqual(['B', 'A']);
    expect(rows.map((row) => row.label)).toEqual(['A', 'B']);
    expect(explainUtilization(summary)).toContain('Average value: 20.00');
  });

  it('normalizes invalid values and filters invalid samples', () => {
    expect(
      normalizeUtilization([
        { organizationId: 'org-1', label: ' Negative ', value: -3, sampleSize: 1 },
        { organizationId: '', label: 'Ignored', value: 1, sampleSize: 1 },
        { organizationId: 'org-1', label: 'NaN', value: Number.NaN, sampleSize: 1 },
      ]),
    ).toEqual([
      { organizationId: 'org-1', label: 'Negative', value: 0, sampleSize: 1 },
      { organizationId: 'org-1', label: 'NaN', value: 0, sampleSize: 1 },
    ]);
  });

  it('shares the aggregation contract across named report types', () => {
    expect(buildNoShowsReport([])).toEqual({ total: 0, average: 0, max: 0, min: 0, top: [] });
  });
});
