import type { ReactNode } from 'react';
import styles from './TeamRoster.module.css';

export interface TeamRosterProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export function TeamRoster({ title, subtitle, children, tone = 'neutral' }: TeamRosterProps) {
  return (
    <section className={`${styles.root} ${styles[tone]}`} data-component="TeamRoster">
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default TeamRoster;
