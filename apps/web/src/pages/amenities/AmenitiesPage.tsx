import React from 'react';
import { PageHeader, Table, Badge, Spinner, EmptyState } from '@waypoint/ui';
import { useAmenities } from '../../hooks/useAmenities.js';

export function AmenitiesPage() {
  const { amenities, loading } = useAmenities();
  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Amenities" />
      {amenities.length === 0 ? (
        <EmptyState title="No amenities" description="Configure parking, lockers, and more." />
      ) : (
        <Table
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'type', header: 'Type', render: (r) => <Badge>{String(r.type)}</Badge> },
            { key: 'capacity', header: 'Capacity' },
            {
              key: 'isActive',
              header: 'Status',
              render: (r) => (
                <Badge variant={r.isActive ? 'success' : 'default'}>
                  {r.isActive ? 'Active' : 'Inactive'}
                </Badge>
              ),
            },
          ]}
          data={amenities as any}
        />
      )}
    </>
  );
}
