import React from 'react';
import { PageHeader, Table, Badge, Spinner } from '@waypoint/ui';
import { useSpaces } from '../../hooks/useSpaces.js';

export function DesksPage() {
  const { desks, spaces, loading } = useSpaces();
  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Desks" subtitle="Manage bookable desks" />
      <Table
        columns={[
          { key: 'label', header: 'Label' },
          {
            key: 'spaceId',
            header: 'Space',
            render: (r) => spaces.find((s) => s.id === r.spaceId)?.name ?? r.spaceId,
          },
          {
            key: 'isBookable',
            header: 'Bookable',
            render: (r) => (
              <Badge variant={r.isBookable ? 'success' : 'default'}>
                {r.isBookable ? 'Yes' : 'No'}
              </Badge>
            ),
          },
        ]}
        data={desks}
      />
    </>
  );
}
