import { describe, it, expect } from 'vitest';
import { computeTotals, buildSubscriptionInvoice, formatMoney } from './invoices.js';

describe('invoices', () => {
  it('computes totals with tax', () => {
    const draft = buildSubscriptionInvoice('org', 'growth', 49, '2024-01-01', '2024-01-31');
    const totals = computeTotals(draft, 0.1);
    expect(totals.subtotalCents).toBe(4900);
    expect(totals.taxCents).toBe(490);
    expect(totals.totalCents).toBe(5390);
  });

  it('formats money', () => {
    expect(formatMoney(4900)).toContain('49');
  });
});
