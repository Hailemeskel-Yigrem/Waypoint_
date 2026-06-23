import { describe, expect, it } from 'vitest';
import { AuditPipelineEngine } from './auditPipelineEngine.js';

describe('AuditPipelineEngine', () => {
  it('rejects oversized audit metadata', () => {
    const metadata = Object.fromEntries(
      Array.from({ length: 51 }, (_, index) => [`field-${index}`, index]),
    );
    const result = new AuditPipelineEngine().process(
      {
        organizationId: 'org-1',
        actorId: 'auditor-1',
        resourceId: 'event-1',
        action: 'write',
        metadata,
      },
      1,
    );

    expect(result).toMatchObject({
      ok: false,
      code: 'AuditPipe_1_FAIL',
      issues: ['metadata too large'],
    });
  });
});
