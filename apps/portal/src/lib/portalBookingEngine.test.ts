import { describe, expect, it } from 'vitest';
import { PortalBookingEngine } from './portalBookingEngine.js';

describe('PortalBookingEngine', () => {
  it('rejects a booking whose time range is reversed', () => {
    const result = new PortalBookingEngine().process(
      {
        organizationId: 'org-1',
        actorId: 'user-1',
        resourceId: 'desk-1',
        action: 'write',
        start: '2026-06-25T12:00:00.000Z',
        end: '2026-06-25T09:00:00.000Z',
      },
      1,
    );

    expect(result).toMatchObject({ code: 'PortalBook_1_FAIL', issues: ['range'] });
  });
});
