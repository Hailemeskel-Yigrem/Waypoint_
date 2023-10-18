import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Button } from '@waypoint/ui';
import { useAuth } from '../hooks/useAuth.js';
import styles from './AdminLayout.module.css';

const nav = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/spaces', label: 'Spaces' },
  { to: '/desks', label: 'Desks' },
  { to: '/bookings', label: 'Bookings' },
  { to: '/bookings/calendar', label: 'Calendar' },
  { to: '/visitors', label: 'Visitors' },
  { to: '/amenities', label: 'Amenities' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/billing', label: 'Billing' },
  { to: '/settings', label: 'Settings' },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Waypoint</div>
        <nav className={styles.nav}>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? styles.active : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className={styles.main}>
        <header className={styles.header}>
          <span>
            {user?.firstName} {user?.lastName}
          </span>
          <Button variant="ghost" size="sm" onClick={logout}>
            Sign out
          </Button>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
