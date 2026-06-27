import React, { useState } from 'react';
import {
  PageHeader,
  Table,
  Button,
  Badge,
  Modal,
  Input,
  Select,
  Spinner,
  useToast,
} from '@waypoint/ui';
import type { SpaceType } from '@waypoint/shared';
import { useSpaces } from '../../hooks/useSpaces.js';
import { Link } from 'react-router-dom';

export function SpacesListPage() {
  const { spaces, loading, create } = useSpaces();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('meeting_room');
  const { push } = useToast();

  const onCreate = async () => {
    await create({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      type: type as SpaceType,
      capacity: 1,
      amenities: [],
    });
    push('Space created', 'success');
    setOpen(false);
    setName('');
  };

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader
        title="Spaces"
        actions={<Button onClick={() => setOpen(true)}>Add space</Button>}
      />
      <Table
        columns={[
          {
            key: 'name',
            header: 'Name',
            render: (r) => <Link to={`/spaces/${r.id}`}>{String(r.name)}</Link>,
          },
          { key: 'type', header: 'Type', render: (r) => <Badge>{String(r.type)}</Badge> },
          { key: 'capacity', header: 'Capacity' },
          { key: 'floor', header: 'Floor' },
        ]}
        data={spaces}
      />
      <Modal
        open={open}
        title="New space"
        onClose={() => setOpen(false)}
        footer={<Button onClick={onCreate}>Create</Button>}
      >
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Select
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={[
            { value: 'meeting_room', label: 'Meeting room' },
            { value: 'open_area', label: 'Open area' },
            { value: 'phone_booth', label: 'Phone booth' },
          ]}
        />
      </Modal>
    </>
  );
}
