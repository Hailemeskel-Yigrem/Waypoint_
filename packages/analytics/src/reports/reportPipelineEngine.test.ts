import { describe, it, expect } from 'vitest';
import { ReportPipelineEngine } from './reportPipelineEngine.js';

describe('ReportPipelineEngine', () => {
  it('runs', () => {
    const e = new ReportPipelineEngine();
    const r = e.runAll({ organizationId: 'o', actorId: 'a', resourceId: 'r', action: 'read' });
    expect(r).toHaveLength(40);
  });
});
