import React from 'react';

export interface ConfirmDialogProps {
  className?: string;
  children?: React.ReactNode;
}

export function ConfirmDialog({ className, children }: ConfirmDialogProps) {
  return (
    <div className={className} data-component="ConfirmDialog">
      {children}
    </div>
  );
}
