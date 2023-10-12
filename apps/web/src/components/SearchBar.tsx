import React from 'react';

export interface SearchBarProps {
  className?: string;
  children?: React.ReactNode;
}

export function SearchBar({ className, children }: SearchBarProps) {
  return (
    <div className={className} data-component="SearchBar">
      {children}
    </div>
  );
}
