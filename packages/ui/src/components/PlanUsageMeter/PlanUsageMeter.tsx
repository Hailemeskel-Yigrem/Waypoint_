import type { ReactNode } from 'react';
import styles from './PlanUsageMeter.module.css';

export interface PlanUsageMeterProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export function PlanUsageMeter({
  title,
  subtitle,
  children,
  tone = 'neutral',
}: PlanUsageMeterProps) {
  return (
    <section className={`${styles.root} ${styles[tone]}`} data-component="PlanUsageMeter">
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default PlanUsageMeter;
