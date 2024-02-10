import React from 'react';
import { PageHeader, Card, Grid, Button } from '@waypoint/ui';
import { Link } from 'react-router-dom';
import { useBookings } from '../hooks/useBookings.js';

export function HomePage() {
  const { bookings } = useBookings();
  const upcoming = bookings
    .filter((b) => b.status === 'confirmed' && new Date(b.startAt) > new Date())
    .slice(0, 3);

  return (
    <>
      <PageHeader title="Welcome back" subtitle="Quick actions for your workday" />
      <Grid cols={2}>
        <Card title="Book workspace">
          <p>Reserve a desk or meeting room.</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Link to="/book/desk">
              <Button size="sm">Book desk</Button>
            </Link>
            <Link to="/book/space">
              <Button size="sm" variant="secondary">
                Book space
              </Button>
            </Link>
          </div>
        </Card>
        <Card title="Upcoming bookings">
          {upcoming.length === 0 ? (
            <p>No upcoming bookings.</p>
          ) : (
            <ul>
              {upcoming.map((b) => (
                <li key={b.id}>
                  {new Date(b.startAt).toLocaleString()} — {b.resourceType}
                </li>
              ))}
            </ul>
          )}
          <Link to="/bookings">View all</Link>
        </Card>
      </Grid>
    </>
  );
}
