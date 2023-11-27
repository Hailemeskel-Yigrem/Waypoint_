import type { ReactNode } from 'react';
import styles from './InvoiceSummary.module.css';

export interface InvoiceSummaryProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export function InvoiceSummary({
  title,
  subtitle,
  children,
  tone = 'neutral',
}: InvoiceSummaryProps) {
  return (
    <section className={`${styles.root} ${styles[tone]}`} data-component="InvoiceSummary">
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default InvoiceSummary;
