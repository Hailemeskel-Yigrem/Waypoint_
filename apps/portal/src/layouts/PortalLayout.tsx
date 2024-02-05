import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Button, Avatar } from '@waypoint/ui';
import { useAuth } from '../hooks/useAuth.js';
import styles from './PortalLayout.module.css';

const nav = [
  { to: '/', label: 'Home', end: true },
  { to: '/book/desk', label: 'Book desk' },
  { to: '/book/space', label: 'Book space' },
  { to: '/bookings', label: 'My bookings' },
  { to: '/visitors/invite', label: 'Invite visitor' },
  { to: '/amenities', label: 'Amenities' },
  { to: '/directory', label: 'Directory' },
];

export function PortalLayout() {
  const { user, logout } = useAuth();
  const name = user ? `${user.firstName} ${user.lastName}` : '';
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.brand}>Waypoint Portal</span>
        <nav className={styles.nav}>
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.user}>
          {user && <Avatar name={name} size="sm" />}
          <Button variant="ghost" size="sm" onClick={logout}>
            Sign out
          </Button>
        </div>
      </header>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
