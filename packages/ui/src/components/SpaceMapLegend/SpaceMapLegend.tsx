import type { ReactNode } from 'react';
import styles from './SpaceMapLegend.module.css';

export interface SpaceMapLegendProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export function SpaceMapLegend({
  title,
  subtitle,
  children,
  tone = 'neutral',
}: SpaceMapLegendProps) {
  return (
    <section className={`${styles.root} ${styles[tone]}`} data-component="SpaceMapLegend">
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default SpaceMapLegend;
