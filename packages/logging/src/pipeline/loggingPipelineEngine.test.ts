import { describe, it, expect } from 'vitest';
import { LoggingPipelineEngine } from './loggingPipelineEngine.js';
describe('LoggingPipelineEngine', () => {
  it('runs', () => {
    expect(
      new LoggingPipelineEngine().runAll({
        organizationId: 'o',
        actorId: 'a',
        resourceId: 'r',
        action: 'read',
      }),
    ).toHaveLength(30);
  });
});
