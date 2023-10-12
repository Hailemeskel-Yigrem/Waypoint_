import React from 'react';

export interface SpaceCardProps {
  className?: string;
  children?: React.ReactNode;
}

export function SpaceCard({ className, children }: SpaceCardProps) {
  return (
    <div className={className} data-component="SpaceCard">
      {children}
    </div>
  );
}
