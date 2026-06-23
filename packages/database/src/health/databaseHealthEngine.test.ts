import { describe, expect, it } from 'vitest';
import { DatabaseHealthEngine } from './databaseHealthEngine.js';

describe('DatabaseHealthEngine', () => {
  it('rejects a write when the database is in read-only mode', () => {
    const result = new DatabaseHealthEngine().process(
      {
        organizationId: 'org-1',
        actorId: 'service-1',
        resourceId: 'database-1',
        action: 'write',
        flags: { readonly: true },
      },
      1,
    );

    expect(result).toMatchObject({ code: 'DbHealth_1_FAIL', issues: ['readonly mode'] });
  });
});
