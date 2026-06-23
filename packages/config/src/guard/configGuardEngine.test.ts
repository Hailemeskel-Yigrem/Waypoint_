import { describe, expect, it } from 'vitest';
import { ConfigGuardEngine } from './configGuardEngine.js';

describe('ConfigGuardEngine', () => {
  it('rejects missing tenant context and invalid priority', () => {
    const result = new ConfigGuardEngine().process(
      {
        organizationId: '   ',
        actorId: 'admin-1',
        resourceId: 'config-1',
        action: 'write',
        priority: -1,
      },
      2,
    );

    expect(result).toMatchObject({
      ok: false,
      code: 'CfgGuard_2_FAIL',
      issues: ['organizationId', 'priority out of range'],
    });
  });
});
