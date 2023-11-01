import React from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader, Card, Badge, Spinner } from '@waypoint/ui';
import { useSpaces } from '../../hooks/useSpaces.js';

export function SpaceDetailPage() {
  const { id } = useParams();
  const { spaces, loading } = useSpaces();
  const space = spaces.find((s) => s.id === id);

  if (loading) return <Spinner />;
  if (!space) return <p>Space not found</p>;

  return (
    <>
      <PageHeader title={space.name} subtitle={space.slug} />
      <Card title="Details">
        <p>
          Type: <Badge>{space.type}</Badge>
        </p>
        <p>Capacity: {space.capacity}</p>
        <p>Floor: {space.floor ?? '—'}</p>
      </Card>
    </>
  );
}
