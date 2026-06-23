import { describe, expect, it } from 'vitest';
import { IntegrationFlowEngine } from './integrationFlowEngine.js';

describe('IntegrationFlowEngine', () => {
  it('rejects requests without a resource identifier', () => {
    const result = new IntegrationFlowEngine().process(
      { organizationId: 'org-1', actorId: 'user-1', resourceId: '', action: 'read' },
      1,
    );

    expect(result).toMatchObject({ code: 'Integrate_1_FAIL', issues: ['resourceId'] });
  });
});
