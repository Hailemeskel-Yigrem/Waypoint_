import React from 'react';

export interface DirectoryEntryProps {
  title?: string;
  children?: React.ReactNode;
}

export function DirectoryEntry({ title, children }: DirectoryEntryProps) {
  return (
    <section data-component="DirectoryEntry">
      {title && <h3>{title}</h3>}
      {children}
    </section>
  );
}
