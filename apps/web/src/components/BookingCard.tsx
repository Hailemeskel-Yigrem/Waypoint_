import React from 'react';

export interface BookingCardProps {
  className?: string;
  children?: React.ReactNode;
}

export function BookingCard({ className, children }: BookingCardProps) {
  return (
    <div className={className} data-component="BookingCard">
      {children}
    </div>
  );
}
