import React, { useState } from 'react';
import { PageHeader, Select, Input, Button, Card, useToast } from '@waypoint/ui';
import { useSpaces } from '../../hooks/useSpaces.js';
import { useBookings } from '../../hooks/useBookings.js';
import { addHours } from '@waypoint/shared';

export function BookDeskPage() {
  const { desks, loading } = useSpaces();
  const { create } = useBookings();
  const [deskId, setDeskId] = useState('');
  const [date, setDate] = useState('');
  const { push } = useToast();

  const bookable = desks.filter((d) => d.isBookable);

  const submit = async () => {
    const start = new Date(date);
    await create({
      resourceType: 'desk',
      resourceId: deskId,
      startAt: start.toISOString(),
      endAt: addHours(start, 8).toISOString(),
    });
    push('Desk booked!', 'success');
  };

  if (loading) return null;

  return (
    <>
      <PageHeader title="Book a desk" />
      <Card>
        <Select
          label="Desk"
          value={deskId}
          onChange={(e) => setDeskId(e.target.value)}
          options={[
            { value: '', label: 'Select desk...' },
            ...bookable.map((d) => ({ value: d.id, label: d.label })),
          ]}
        />
        <Input
          label="Date & time"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button onClick={submit} disabled={!deskId || !date}>
          Confirm booking
        </Button>
      </Card>
    </>
  );
}
