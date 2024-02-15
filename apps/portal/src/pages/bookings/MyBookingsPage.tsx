import React from 'react';
import { PageHeader, Table, Badge, Button, Spinner } from '@waypoint/ui';
import { useBookings } from '../../hooks/useBookings.js';

export function MyBookingsPage() {
  const { bookings, loading, cancel } = useBookings();
  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="My bookings" />
      <Table
        columns={[
          { key: 'resourceType', header: 'Type' },
          {
            key: 'startAt',
            header: 'When',
            render: (r) => new Date(String(r.startAt)).toLocaleString(),
          },
          { key: 'status', header: 'Status', render: (r) => <Badge>{String(r.status)}</Badge> },
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
