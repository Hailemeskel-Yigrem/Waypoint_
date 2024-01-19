import React from 'react';

export interface AmenityCardProps {
  title?: string;
  children?: React.ReactNode;
}

export function AmenityCard({ title, children }: AmenityCardProps) {
  return (
    <section data-component="AmenityCard">
      {title && <h3>{title}</h3>}
      {children}
    </section>
  );
}
