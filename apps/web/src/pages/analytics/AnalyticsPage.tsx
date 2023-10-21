import React from 'react';
import { PageHeader, Card, Table, Spinner } from '@waypoint/ui';
import { useAnalytics } from '../../hooks/useAnalytics.js';
import { formatMoney, money } from '@waypoint/shared';

export function AnalyticsPage() {
  const { data, loading } = useAnalytics(30);
  if (loading) return <Spinner />;

  const totalBookings = data.reduce((s, d) => s + d.bookingsCount, 0);
  const totalRevenue = data.reduce((s, d) => s + d.revenueCents, 0);

  return (
    <>
      <PageHeader title="Analytics" subtitle="Last 30 days" />
      <Card title="Summary">
        <p>
          Total bookings: <strong>{totalBookings}</strong>
        </p>
        <p>
          Total revenue: <strong>{formatMoney(money(totalRevenue))}</strong>
        </p>
      </Card>
      <Table
        columns={[
          { key: 'date', header: 'Date' },
          { key: 'bookingsCount', header: 'Bookings' },
          { key: 'visitorsCount', header: 'Visitors' },
          { key: 'occupancyRate', header: 'Occupancy %', render: (r) => `${r.occupancyRate}%` },
        ]}
        data={data as any}
      />
    </>
  );
}
