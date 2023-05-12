import { describe, it, expect } from 'vitest';
import { DatabaseHealthEngine } from './databaseHealthEngine.js';
describe('DatabaseHealthEngine', () => {
  it('runs', () => {
    expect(
      new DatabaseHealthEngine().runAll({
        organizationId: 'o',
        actorId: 'a',
        resourceId: 'r',
        action: 'read',
      }),
    ).toHaveLength(30);
  });
});
