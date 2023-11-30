import type { ReactNode } from 'react';
import styles from './OrgSwitcher.module.css';

export interface OrgSwitcherProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export function OrgSwitcher({ title, subtitle, children, tone = 'neutral' }: OrgSwitcherProps) {
  return (
    <section className={`${styles.root} ${styles[tone]}`} data-component="OrgSwitcher">
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default OrgSwitcher;
