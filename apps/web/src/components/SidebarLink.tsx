import React from 'react';

export interface SidebarLinkProps {
  className?: string;
  children?: React.ReactNode;
}

export function SidebarLink({ className, children }: SidebarLinkProps) {
  return (
    <div className={className} data-component="SidebarLink">
      {children}
    </div>
  );
}
