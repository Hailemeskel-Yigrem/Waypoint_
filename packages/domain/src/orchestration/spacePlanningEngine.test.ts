import { describe, expect, it } from 'vitest';
import { SpacePlanningEngine } from './spacePlanningEngine.js';

describe('SpacePlanningEngine', () => {
  it('rejects an allocation whose end precedes its start', () => {
    const result = new SpacePlanningEngine().process(
      {
        organizationId: 'org-1',
        actorId: 'planner-1',
        resourceId: 'floor-1',
        action: 'write',
        start: '2026-06-25T12:00:00.000Z',
        end: '2026-06-25T09:00:00.000Z',
      },
      7,
    );

    expect(result).toEqual({
      ok: false,
      code: 'SpacePlan_7_FAIL',
      issues: ['range'],
      score: 90,
    });
  });
});
