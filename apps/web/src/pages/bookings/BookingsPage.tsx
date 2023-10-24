import React from 'react';
import { PageHeader, Table, Badge, Button, Spinner } from '@waypoint/ui';
import { useBookings } from '../../hooks/useBookings.js';
import { formatDuration, minutesBetween, parseISODate } from '@waypoint/shared';

export function BookingsPage() {
  const { bookings, loading, cancel } = useBookings();
  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Bookings" subtitle="All workspace reservations" />
      <Table
        columns={[
          { key: 'resourceType', header: 'Resource' },
          {
            key: 'startAt',
            header: 'Start',
            render: (r) => new Date(String(r.startAt)).toLocaleString(),
          },
          {
            key: 'duration',
            header: 'Duration',
            render: (r) =>
              formatDuration(
                minutesBetween(parseISODate(String(r.startAt)), parseISODate(String(r.endAt))),
              ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (r) => (
              <Badge variant={r.status === 'confirmed' ? 'success' : 'default'}>
                {String(r.status)}
              </Badge>
            ),
          },
          {
            key: 'actions',
            header: '',
            render: (r) =>
              r.status === 'confirmed' ? (
                <Button size="sm" variant="ghost" onClick={() => cancel(String(r.id))}>
                  Cancel
                </Button>
              ) : null,
          },
        ]}
        data={bookings as any}
      />
    </>
  );
}
