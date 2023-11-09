import type { ReactNode } from 'react';
import styles from './AmenityPicker.module.css';

export interface AmenityPickerProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export function AmenityPicker({ title, subtitle, children, tone = 'neutral' }: AmenityPickerProps) {
  return (
    <section className={`${styles.root} ${styles[tone]}`} data-component="AmenityPicker">
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export default AmenityPicker;
