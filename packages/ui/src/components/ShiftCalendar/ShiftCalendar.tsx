import type { ReactNode } from 'react';
import styles from './ShiftCalendar.module.css';

export interface ShiftCalendarProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export function ShiftCalendar({ title, subtitle, children, tone = 'neutral' }: ShiftCalendarProps) {
  return (
    <section className={`${styles.root} ${styles[tone]}`} data-component="ShiftCalendar">
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default ShiftCalendar;
