import React from 'react';

export interface VisitorRowProps {
  className?: string;
  children?: React.ReactNode;
}

export function VisitorRow({ className, children }: VisitorRowProps) {
  return (
    <div className={className} data-component="VisitorRow">
      {children}
    </div>
  );
}
