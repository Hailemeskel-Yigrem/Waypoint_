import React from 'react';
import styles from './Stack.module.css';
import { cn } from '../utils/cn.js';

export interface StackProps {
  children: React.ReactNode;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Stack({ children, gap = 'md', className }: StackProps) {
  return <div className={cn(styles.stack, styles[`gap-${gap}`], className)}>{children}</div>;
}
