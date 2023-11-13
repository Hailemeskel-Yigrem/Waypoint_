import React from 'react';
import styles from './Avatar.module.css';
import { cn } from '../../utils/cn.js';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <span className={cn(styles.avatar, styles[size], className)} title={name}>
      {src ? <img src={src} alt={name} className={styles.img} /> : initials(name)}
    </span>
  );
}
