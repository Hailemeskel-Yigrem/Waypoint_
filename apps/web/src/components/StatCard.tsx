import React from 'react';

export interface StatCardProps {
  className?: string;
  children?: React.ReactNode;
}

export function StatCard({ className, children }: StatCardProps) {
  return (
    <div className={className} data-component="StatCard">
      {children}
    </div>
  );
}
