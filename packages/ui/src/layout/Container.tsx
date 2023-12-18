import React from 'react';
import styles from './Container.module.css';
import { cn } from '../utils/cn.js';

export interface ContainerProps {
  children: React.ReactNode;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Container({ children, gap = 'md', className }: ContainerProps) {
  return <div className={cn(styles.container, styles[`gap-${gap}`], className)}>{children}</div>;
}
