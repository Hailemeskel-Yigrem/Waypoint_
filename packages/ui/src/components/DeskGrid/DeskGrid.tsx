import type { ReactNode } from 'react';
import styles from './DeskGrid.module.css';

export interface DeskGridProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export function DeskGrid({ title, subtitle, children, tone = 'neutral' }: DeskGridProps) {
  return (
    <section className={`${styles.root} ${styles[tone]}`} data-component="DeskGrid">
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default DeskGrid;
