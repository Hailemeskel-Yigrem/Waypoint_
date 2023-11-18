import type { ReactNode } from 'react';
import styles from './CheckInScanner.module.css';

export interface CheckInScannerProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export function CheckInScanner({
  title,
  subtitle,
  children,
  tone = 'neutral',
}: CheckInScannerProps) {
  return (
    <section className={`${styles.root} ${styles[tone]}`} data-component="CheckInScanner">
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default CheckInScanner;
