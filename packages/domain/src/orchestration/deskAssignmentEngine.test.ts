import { describe, expect, it } from 'vitest';
import { DeskAssignmentEngine } from './deskAssignmentEngine.js';

describe('DeskAssignmentEngine', () => {
  it('blocks assignments that conflict with maintenance and quantity limits', () => {
    const engine = new DeskAssignmentEngine();
    const results = engine.runAll({
      organizationId: 'org-1',
      actorId: 'user-1',
      resourceId: 'desk-1',
      action: 'write',
      quantity: 0,
      flags: { maintenance: true },
    });

    expect(results).toHaveLength(40);
    expect(results[0]).toEqual({
      ok: false,
      code: 'DeskAssign_1_FAIL',
      issues: ['quantity', 'maintenance blocks write'],
      score: 79,
    });
    expect(engine.summarize(results)).toMatchObject({ passed: 0, failed: 40 });
  });
});
