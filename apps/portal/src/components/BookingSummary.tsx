import React from 'react';

export interface BookingSummaryProps {
  title?: string;
  children?: React.ReactNode;
}

export function BookingSummary({ title, children }: BookingSummaryProps) {
  return (
    <section data-component="BookingSummary">
      {title && <h3>{title}</h3>}
      {children}
    </section>
  );
}
