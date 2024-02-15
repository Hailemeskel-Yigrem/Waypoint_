import React, { useState } from 'react';
import { PageHeader, Select, Input, Button, Card, useToast } from '@waypoint/ui';
import { useSpaces } from '../../hooks/useSpaces.js';
import { useBookings } from '../../hooks/useBookings.js';
import { addHours } from '@waypoint/shared';

export function BookSpacePage() {
  const { spaces } = useSpaces();
  const { create } = useBookings();
  const [spaceId, setSpaceId] = useState('');
  const [date, setDate] = useState('');
  const { push } = useToast();

  const rooms = spaces.filter((s) => s.type === 'meeting_room' || s.type === 'phone_booth');

  const submit = async () => {
    const start = new Date(date);
    await create({
      resourceType: 'space',
      resourceId: spaceId,
      startAt: start.toISOString(),
      endAt: addHours(start, 1).toISOString(),
    });
    push('Space booked!', 'success');
  };

  return (
    <>
      <PageHeader title="Book a space" />
      <Card>
        <Select
          label="Space"
          value={spaceId}
          onChange={(e) => setSpaceId(e.target.value)}
          options={[
            { value: '', label: 'Select space...' },
            ...rooms.map((s) => ({ value: s.id, label: s.name })),
          ]}
        />
        <Input
          label="Start time"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button onClick={submit} disabled={!spaceId || !date}>
          Confirm booking
        </Button>
      </Card>
    </>
  );
}
