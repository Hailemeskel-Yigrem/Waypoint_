import type { ReactNode } from 'react';
import styles from './WebhookStatus.module.css';

export interface WebhookStatusProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export function WebhookStatus({ title, subtitle, children, tone = 'neutral' }: WebhookStatusProps) {
  return (
    <section className={`${styles.root} ${styles[tone]}`} data-component="WebhookStatus">
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default WebhookStatus;
