import React from 'react';

export interface QuickActionProps {
  title?: string;
  children?: React.ReactNode;
}

export function QuickAction({ title, children }: QuickActionProps) {
  return (
    <section data-component="QuickAction">
      {title && <h3>{title}</h3>}
      {children}
    </section>
  );
}
