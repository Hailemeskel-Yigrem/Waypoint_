import React from 'react';

export interface DatePickerProps {
  className?: string;
  children?: React.ReactNode;
}

export function DatePicker({ className, children }: DatePickerProps) {
  return (
    <div className={className} data-component="DatePicker">
      {children}
    </div>
  );
}
