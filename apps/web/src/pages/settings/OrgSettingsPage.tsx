import React, { useState, useEffect } from 'react';
import { PageHeader, Input, Button, Card, useToast } from '@waypoint/ui';
import { useOrg } from '../../hooks/useOrg.js';

export function OrgSettingsPage() {
  const { org, loading, update } = useOrg();
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const { push } = useToast();

  useEffect(() => {
    if (org) {
      setName(org.name);
      setTimezone(org.timezone);
    }
  }, [org]);

  if (loading) return null;

  const save = async () => {
    await update({ name, timezone });
    push('Settings saved', 'success');
  };

  return (
    <>
      <PageHeader title="Organization settings" />
      <Card>
        <Input label="Organization name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
        <Button onClick={save}>Save changes</Button>
      </Card>
    </>
  );
}
