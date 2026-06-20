import { describe, it, expect } from 'vitest';
import { SharedGuardEngine } from './sharedGuardEngine.js';
describe('SharedGuardEngine', () => {
  it('runs', () => {
    expect(
      new SharedGuardEngine().runAll({
        organizationId: 'o',
        actorId: 'a',
        resourceId: 'r',
        action: 'read',
      }),
    ).toHaveLength(30);
  });
});
