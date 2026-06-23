import { describe, expect, it } from 'vitest';
import { AmenityFlowEngine } from './amenityFlowEngine.js';

describe('AmenityFlowEngine', () => {
  it('blocks writes during maintenance', () => {
    const result = new AmenityFlowEngine().process(
      {
        organizationId: 'org-1',
        actorId: 'user-1',
        resourceId: 'amenity-1',
        action: 'write',
        flags: { maintenance: true },
      },
      35,
    );

    expect(result).toMatchObject({
      code: 'Amenity_35_FAIL',
      issues: ['maintenance blocks write'],
    });
  });
});
