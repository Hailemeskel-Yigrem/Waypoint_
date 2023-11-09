import type { ReactNode } from 'react';
import styles from './AuditTimeline.module.css';

export interface AuditTimelineProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export function AuditTimeline({ title, subtitle, children, tone = 'neutral' }: AuditTimelineProps) {
  return (
    <section className={`${styles.root} ${styles[tone]}`} data-component="AuditTimeline">
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default AuditTimeline;
