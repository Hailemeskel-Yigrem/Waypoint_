import React from 'react';

export interface VisitorFormProps {
  title?: string;
  children?: React.ReactNode;
}

export function VisitorForm({ title, children }: VisitorFormProps) {
  return (
    <section data-component="VisitorForm">
      {title && <h3>{title}</h3>}
      {children}
    </section>
  );
}
