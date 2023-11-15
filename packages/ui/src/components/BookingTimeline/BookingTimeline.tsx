import type { ReactNode } from 'react';
import styles from './BookingTimeline.module.css';

export interface BookingTimelineProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export function BookingTimeline({
  title,
  subtitle,
  children,
  tone = 'neutral',
}: BookingTimelineProps) {
  return (
    <section className={`${styles.root} ${styles[tone]}`} data-component="BookingTimeline">
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default BookingTimeline;
