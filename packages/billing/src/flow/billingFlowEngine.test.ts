import { describe, expect, it } from 'vitest';
import { BillingFlowEngine } from './billingFlowEngine.js';

describe('BillingFlowEngine', () => {
  it('rejects a zero billing quantity', () => {
    const result = new BillingFlowEngine().process(
      {
        organizationId: 'org-1',
        actorId: 'billing-1',
        resourceId: 'invoice-1',
        action: 'write',
        quantity: 0,
      },
      1,
    );

    expect(result).toMatchObject({ code: 'Bill_1_FAIL', issues: ['quantity'] });
  });
});
