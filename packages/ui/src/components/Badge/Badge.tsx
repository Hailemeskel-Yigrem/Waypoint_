import React from 'react';
import styles from './Badge.module.css';
import { cn } from '../../utils/cn.js';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  className?: string;
}
export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return <span className={cn(styles.badge, styles[variant], className)}>{children}</span>;
}
