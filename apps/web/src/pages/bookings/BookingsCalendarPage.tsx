import React, { useMemo } from 'react';
import { PageHeader, Card, Spinner } from '@waypoint/ui';
import { useBookings } from '../../hooks/useBookings.js';
import { isSameDay, parseISODate } from '@waypoint/shared';
import styles from './BookingsCalendarPage.module.css';

export function BookingsCalendarPage() {
  const { bookings, loading } = useBookings();
  const days = useMemo(() => {
    const result: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push(d);
    }
    return result;
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Bookings calendar" subtitle="Next 7 days" />
      <div className={styles.grid}>
        {days.map((day) => {
          const dayBookings = bookings.filter(
            (b) => isSameDay(parseISODate(b.startAt), day) && b.status !== 'cancelled',
          );
          return (
            <Card
              key={day.toISOString()}
              title={day.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            >
              {dayBookings.length === 0 ? (
                <p className={styles.empty}>No bookings</p>
              ) : (
                <ul className={styles.list}>
                  {dayBookings.map((b) => (
                    <li key={b.id}>
                      {new Date(b.startAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      — {b.resourceType}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
