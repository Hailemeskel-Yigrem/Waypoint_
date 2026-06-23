import { describe, expect, it } from 'vitest';
import { VisitorFlowEngine } from './visitorFlowEngine.js';

describe('VisitorFlowEngine', () => {
  it('requires a complete visitor window', () => {
    const result = new VisitorFlowEngine().process(
      {
        organizationId: 'org-1',
        actorId: 'host-1',
        resourceId: 'visitor-1',
        action: 'write',
        start: '2026-06-25T09:00:00.000Z',
      },
      1,
    );

    expect(result).toMatchObject({ code: 'Visitor_1_FAIL', issues: ['range'] });
  });
});
