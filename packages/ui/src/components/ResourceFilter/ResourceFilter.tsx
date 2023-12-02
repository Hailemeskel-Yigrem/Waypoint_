import type { ReactNode } from 'react';
import styles from './ResourceFilter.module.css';

export interface ResourceFilterProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export function ResourceFilter({
  title,
  subtitle,
  children,
  tone = 'neutral',
}: ResourceFilterProps) {
  return (
    <section className={`${styles.root} ${styles[tone]}`} data-component="ResourceFilter">
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default ResourceFilter;
