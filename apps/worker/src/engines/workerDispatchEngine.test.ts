import { describe, expect, it } from 'vitest';
import { WorkerDispatchEngine } from './workerDispatchEngine.js';

describe('WorkerDispatchEngine', () => {
  it('rejects work without an actor context', () => {
    const result = new WorkerDispatchEngine().process(
      { organizationId: 'org-1', actorId: '', resourceId: 'job-1', action: 'write' },
      1,
    );

    expect(result).toMatchObject({ code: 'Dispatch_1_FAIL', issues: ['actorId'] });
  });
});
