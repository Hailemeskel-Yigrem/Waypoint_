import React, { useState } from 'react';
import { PageHeader, Input, Grid, Card, Avatar, Spinner } from '@waypoint/ui';
import { useDirectory } from '../../hooks/useDirectory.js';

export function DirectoryPage() {
  const { users, loading } = useDirectory();
  const [query, setQuery] = useState('');

  if (loading) return <Spinner />;

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <PageHeader title="Employee directory" />
      <Input
        placeholder="Search by name or email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Grid cols={2}>
        {filtered.map((u) => (
          <Card key={u.id}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Avatar name={`${u.firstName} ${u.lastName}`} src={u.avatarUrl} />
              <div>
                <strong>
                  {u.firstName} {u.lastName}
                </strong>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                  {u.title ?? u.role} · {u.email}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </Grid>
    </>
  );
}
