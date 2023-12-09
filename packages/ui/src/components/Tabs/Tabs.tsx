import React, { useState } from 'react';
import styles from './Tabs.module.css';
import { cn } from '../../utils/cn.js';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}
export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
}

export function Tabs({ items, defaultTab }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? items[0]?.id ?? '');
  const current = items.find((t) => t.id === active);
  return (
    <div className={styles.tabs}>
      <div className={styles.list} role="tablist">
        {items.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            className={cn(styles.tab, active === t.id && styles.active)}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className={styles.panel} role="tabpanel">
        {current?.content}
      </div>
    </div>
  );
}
