import React from 'react';
import styles from './FormField.module.css';
import { cn } from '../../utils/cn.js';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
}
export function FormField({ label, required, error, children, htmlFor }: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={cn(styles.label, required && styles.required)}>
        {label}
      </label>
      {children}
      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
