import { describe, it, expect } from 'vitest';
import { DeskAssignmentEngine } from './deskAssignmentEngine.js';

describe('DeskAssignmentEngine', () => {
  it('runs', () => {
    const e = new DeskAssignmentEngine();
    const r = e.runAll({ organizationId: 'o', actorId: 'a', resourceId: 'r', action: 'read' });
    expect(r).toHaveLength(40);
  });
});
