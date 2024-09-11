export interface InvoiceLine {
  description: string;
  quantity: number;
  unitAmountCents: number;
}

export interface InvoiceDraft {
  organizationId: string;
  periodStart: string;
  periodEnd: string;
  currency: 'USD';
  lines: InvoiceLine[];
}

export interface InvoiceTotals {
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
}

export function lineTotal(line: InvoiceLine): number {
  return line.quantity * line.unitAmountCents;
}

export function computeTotals(draft: InvoiceDraft, taxRate = 0): InvoiceTotals {
  const subtotalCents = draft.lines.reduce((sum, line) => sum + lineTotal(line), 0);
  const taxCents = Math.round(subtotalCents * taxRate);
  return { subtotalCents, taxCents, totalCents: subtotalCents + taxCents };
}

export function formatMoney(cents: number, currency: 'USD' = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}

export function buildSubscriptionInvoice(
  organizationId: string,
  planCode: string,
  priceUsdMonthly: number,
  periodStart: string,
  periodEnd: string,
): InvoiceDraft {
  return {
    organizationId,
    periodStart,
    periodEnd,
    currency: 'USD',
    lines: [
      {
        description: `Waypoint ${planCode} plan`,
        quantity: 1,
        unitAmountCents: Math.round(priceUsdMonthly * 100),
      },
    ],
  };
}
