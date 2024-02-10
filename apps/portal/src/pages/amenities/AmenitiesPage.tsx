import React from 'react';
import { PageHeader, Card, Grid, Badge, Spinner } from '@waypoint/ui';
import { useAmenities } from '../../hooks/useAmenities.js';

export function AmenitiesPage() {
  const { amenities, loading } = useAmenities();
  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Amenities" subtitle="Available workplace amenities" />
      <Grid cols={3}>
        {amenities.map((a) => (
          <Card key={a.id} title={a.name}>
            <Badge>{a.type}</Badge>
            <p>Capacity: {a.capacity}</p>
          </Card>
        ))}
      </Grid>
    </>
  );
}
