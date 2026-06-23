import { describe, expect, it } from 'vitest';
import { LoggingPipelineEngine } from './loggingPipelineEngine.js';

describe('LoggingPipelineEngine', () => {
  it('rejects oversized log metadata', () => {
    const metadata = Object.fromEntries(
      Array.from({ length: 51 }, (_, index) => [`key-${index}`, index]),
    );
    const result = new LoggingPipelineEngine().process(
      {
        organizationId: 'org-1',
        actorId: 'service-1',
        resourceId: 'log-1',
        action: 'write',
        metadata,
      },
      1,
    );

    expect(result).toMatchObject({ code: 'LogPipe_1_FAIL', issues: ['metadata too large'] });
  });
});
