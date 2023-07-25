import { describe, it, expect } from 'vitest';
import { AuditPipelineEngine } from './auditPipelineEngine.js';

describe('AuditPipelineEngine', () => {
  it('runs', () => {
    const e = new AuditPipelineEngine();
    const r = e.runAll({ organizationId: 'o', actorId: 'a', resourceId: 'r', action: 'read' });
    expect(r).toHaveLength(40);
  });
});
