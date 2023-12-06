import React from 'react';
import styles from './Spinner.module.css';
import { cn } from '../../utils/cn.js';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}
export function Spinner({ size = 'md', className, label = 'Loading' }: SpinnerProps) {
  return (
    <div className={cn(styles.spinner, styles[size], className)} role="status" aria-label={label} />
  );
}
