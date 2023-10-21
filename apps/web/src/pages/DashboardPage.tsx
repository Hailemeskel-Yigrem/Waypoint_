import React from 'react';
import { PageHeader, Card, Grid, Spinner } from '@waypoint/ui';
import { useBookings } from '../hooks/useBookings.js';
import { useVisitors } from '../hooks/useVisitors.js';
import { useAnalytics } from '../hooks/useAnalytics.js';

export function DashboardPage() {
  const { bookings, loading: lb } = useBookings();
  const { visitors, loading: lv } = useVisitors();
  const { data: analytics, loading: la } = useAnalytics(7);

  if (lb || lv || la) return <Spinner />;

  const todayBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const expectedVisitors = visitors.filter((v) => v.status === 'expected').length;
  const avgOccupancy = analytics.length
    ? Math.round(analytics.reduce((s, a) => s + a.occupancyRate, 0) / analytics.length)
    : 0;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of your workplace" />
      <Grid cols={3}>
        <Card title="Today's bookings">
          <strong>{todayBookings}</strong>
        </Card>
        <Card title="Expected visitors">
          <strong>{expectedVisitors}</strong>
        </Card>
        <Card title="Avg occupancy (7d)">
          <strong>{avgOccupancy}%</strong>
        </Card>
      </Grid>
    </>
  );
}
