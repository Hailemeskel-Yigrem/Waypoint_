import type { ReactNode } from 'react';
import styles from './VisitorBadge.module.css';

export interface VisitorBadgeProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export function VisitorBadge({ title, subtitle, children, tone = 'neutral' }: VisitorBadgeProps) {
  return (
    <section className={`${styles.root} ${styles[tone]}`} data-component="VisitorBadge">
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default VisitorBadge;
