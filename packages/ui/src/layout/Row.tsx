import React from 'react';
import styles from './Row.module.css';
import { cn } from '../utils/cn.js';

export interface RowProps {
  children: React.ReactNode;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Row({ children, gap = 'md', className }: RowProps) {
  return <div className={cn(styles.row, styles[`gap-${gap}`], className)}>{children}</div>;
}
