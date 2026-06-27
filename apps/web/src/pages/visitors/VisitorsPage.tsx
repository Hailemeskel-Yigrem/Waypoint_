import React, { useState } from 'react';
import { PageHeader, Table, Badge, Button, Modal, Input, Spinner, useToast } from '@waypoint/ui';
import { useVisitors } from '../../hooks/useVisitors.js';
import { useAuth } from '../../hooks/useAuth.js';

export function VisitorsPage() {
  const { visitors, loading, create } = useVisitors();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', expectedAt: '' });
  const { push } = useToast();

  const onCreate = async () => {
    if (!user) return;
    await create({
      ...form,
      hostUserId: user.id,
      expectedAt: new Date(form.expectedAt).toISOString(),
    });
    push('Visitor registered', 'success');
    setOpen(false);
  };

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader
        title="Visitors"
        actions={<Button onClick={() => setOpen(true)}>Register visitor</Button>}
      />
      <Table
        columns={[
          { key: 'name', header: 'Name', render: (r) => `${r.firstName} ${r.lastName}` },
          { key: 'email', header: 'Email' },
          {
            key: 'expectedAt',
            header: 'Expected',
            render: (r) => new Date(String(r.expectedAt)).toLocaleString(),
          },
          { key: 'status', header: 'Status', render: (r) => <Badge>{String(r.status)}</Badge> },
        ]}
        data={visitors}
      />
      <Modal
        open={open}
        title="Register visitor"
        onClose={() => setOpen(false)}
        footer={<Button onClick={onCreate}>Save</Button>}
      >
        <Input
          label="First name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
        <Input
          label="Last name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Expected at"
          type="datetime-local"
          value={form.expectedAt}
          onChange={(e) => setForm({ ...form, expectedAt: e.target.value })}
        />
      </Modal>
    </>
  );
}
