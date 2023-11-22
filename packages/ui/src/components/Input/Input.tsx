import React from 'react';
import styles from './Input.module.css';
import { cn } from '../../utils/cn.js';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, className, id, ...rest }: InputProps) {
  const inputId = id ?? rest.name;
  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(styles.input, error && styles.error, className)}
        aria-invalid={!!error}
        {...rest}
      />
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && (
        <span className={styles.errorText} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
