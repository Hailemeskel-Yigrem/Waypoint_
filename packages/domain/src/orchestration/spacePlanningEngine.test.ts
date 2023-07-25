import { describe, it, expect } from 'vitest';
import { SpacePlanningEngine } from './spacePlanningEngine.js';

describe('SpacePlanningEngine', () => {
  it('runs', () => {
    const e = new SpacePlanningEngine();
    const r = e.runAll({ organizationId: 'o', actorId: 'a', resourceId: 'r', action: 'read' });
    expect(r).toHaveLength(40);
  });
});
