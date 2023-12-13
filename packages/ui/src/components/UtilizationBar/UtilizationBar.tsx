import type { ReactNode } from 'react';
import styles from './UtilizationBar.module.css';

export interface UtilizationBarProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export function UtilizationBar({
  title,
  subtitle,
  children,
  tone = 'neutral',
}: UtilizationBarProps) {
  return (
    <section className={`${styles.root} ${styles[tone]}`} data-component="UtilizationBar">
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default UtilizationBar;
