import React from 'react';
import { PageHeader, Table, Badge, Spinner } from '@waypoint/ui';
import { useBilling } from '../../hooks/useBilling.js';
import { formatMoney, type Money } from '@waypoint/shared';

export function BillingPage() {
  const { invoices, loading } = useBilling();
  if (loading) return <Spinner />;

  const statusVariant = (s: string) => {
    if (s === 'paid') return 'success';
    if (s === 'overdue') return 'error';
    if (s === 'sent') return 'info';
    return 'default';
  };

  return (
    <>
      <PageHeader title="Billing" subtitle="Invoices and payments" />
      <Table
        columns={[
          { key: 'number', header: 'Invoice #' },
          { key: 'period', header: 'Period', render: (r) => `${r.periodStart} — ${r.periodEnd}` },
          { key: 'total', header: 'Total', render: (r) => formatMoney(r.total as Money) },
          {
            key: 'status',
            header: 'Status',
            render: (r) => (
              <Badge variant={statusVariant(String(r.status))}>{String(r.status)}</Badge>
            ),
          },
          {
            key: 'dueAt',
            header: 'Due',
            render: (r) => new Date(String(r.dueAt)).toLocaleDateString(),
          },
        ]}
        data={invoices}
      />
    </>
  );
}
