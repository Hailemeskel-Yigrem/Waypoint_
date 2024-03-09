import { describe, it, expect } from 'vitest';
import { NotificationFlowEngine } from './notificationFlowEngine.js';

describe('NotificationFlowEngine', () => {
  it('passes a clean write', () => {
    const engine = new NotificationFlowEngine();
    const results = engine.runAll({
      organizationId: 'org',
      actorId: 'user',
      resourceId: 'res',
      action: 'write',
      start: '2024-01-01T10:00:00Z',
      end: '2024-01-01T11:00:00Z',
      quantity: 1,
      priority: 1,
      channel: 'email',
    });
    const summary = engine.summarize(results);
    expect(summary.passed).toBeGreaterThan(0);
    expect(results).toHaveLength(35);
  });
});
