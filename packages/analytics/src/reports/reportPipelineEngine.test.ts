import { describe, expect, it } from 'vitest';
import { ReportPipelineEngine } from './reportPipelineEngine.js';

describe('ReportPipelineEngine', () => {
  it('rejects unsupported delivery channels and excessive tags', () => {
    const result = new ReportPipelineEngine().process(
      {
        organizationId: 'org-1',
        actorId: 'analyst-1',
        resourceId: 'report-1',
        action: 'read',
        channel: 'fax',
        tags: Array.from({ length: 21 }, (_, index) => `tag-${index}`),
      },
      1,
    );

    expect(result).toMatchObject({
      ok: false,
      code: 'ReportPipe_1_FAIL',
      issues: ['too many tags', 'bad channel'],
    });
  });
});
