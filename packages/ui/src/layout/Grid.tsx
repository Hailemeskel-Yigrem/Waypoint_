import React from 'react';
import styles from './Grid.module.css';
import { cn } from '../utils/cn.js';

export interface GridProps {
  children: React.ReactNode;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
  cols?: 2 | 3 | 4;
}

export function Grid({ children, gap = 'md', className, cols = 2 }: GridProps) {
  return (
    <div className={cn(styles.grid, styles[`gap-${gap}`], styles[`cols-${cols}`], className)}>
      {children}
    </div>
  );
}
