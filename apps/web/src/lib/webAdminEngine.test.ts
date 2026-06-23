import { describe, expect, it } from 'vitest';
import { WebAdminEngine } from './webAdminEngine.js';

describe('WebAdminEngine', () => {
  it('rejects an out-of-range administrative priority', () => {
    const result = new WebAdminEngine().process(
      {
        organizationId: 'org-1',
        actorId: 'admin-1',
        resourceId: 'setting-1',
        action: 'write',
        priority: 11,
      },
      1,
    );

    expect(result).toMatchObject({ code: 'Admin_1_FAIL', issues: ['priority out of range'] });
  });
});
