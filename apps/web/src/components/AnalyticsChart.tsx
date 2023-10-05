import React from 'react';

export interface AnalyticsChartProps {
  className?: string;
  children?: React.ReactNode;
}

export function AnalyticsChart({ className, children }: AnalyticsChartProps) {
  return (
    <div className={className} data-component="AnalyticsChart">
      {children}
    </div>
  );
}
