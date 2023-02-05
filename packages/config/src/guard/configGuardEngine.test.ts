import { describe, it, expect } from 'vitest';
import { ConfigGuardEngine } from './configGuardEngine.js';

describe('ConfigGuardEngine', () => {
  it('runs', () => {
    const e = new ConfigGuardEngine();
    const r = e.runAll({ organizationId: 'o', actorId: 'a', resourceId: 'r', action: 'read' });
    expect(r).toHaveLength(40);
  });
});
