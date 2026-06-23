import { describe, expect, it } from 'vitest';
import { NotificationFlowEngine } from './notificationFlowEngine.js';

describe('NotificationFlowEngine', () => {
  it('rejects unsupported notification channels', () => {
    const result = new NotificationFlowEngine().process(
      {
        organizationId: 'org-1',
        actorId: 'user-1',
        resourceId: 'notification-1',
        action: 'write',
        channel: 'carrier-pigeon',
      },
      1,
    );

    expect(result).toMatchObject({ code: 'Notify_1_FAIL', issues: ['bad channel'] });
  });
});
