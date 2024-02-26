import React, { useState } from 'react';
import { PageHeader, Input, Button, Card, useToast } from '@waypoint/ui';
import { useVisitors } from '../../hooks/useVisitors.js';
import { useAuth } from '../../hooks/useAuth.js';

export function InviteVisitorPage() {
  const { create } = useVisitors();
  const { user } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', expectedAt: '' });
  const { push } = useToast();

  const submit = async () => {
    if (!user) return;
    await create({
      ...form,
      hostUserId: user.id,
      expectedAt: new Date(form.expectedAt).toISOString(),
    });
    push('Visitor invited', 'success');
    setForm({ firstName: '', lastName: '', email: '', expectedAt: '' });
  };

  return (
    <>
      <PageHeader title="Invite a visitor" subtitle="Pre-register guests for a smooth check-in" />
      <Card>
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
          label="Expected arrival"
          type="datetime-local"
          value={form.expectedAt}
          onChange={(e) => setForm({ ...form, expectedAt: e.target.value })}
        />
        <Button onClick={submit}>Send invitation</Button>
      </Card>
    </>
  );
}
