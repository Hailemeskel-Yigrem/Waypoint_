import React from 'react';

export interface WelcomeBannerProps {
  title?: string;
  children?: React.ReactNode;
}

export function WelcomeBanner({ title, children }: WelcomeBannerProps) {
  return (
    <section data-component="WelcomeBanner">
      {title && <h3>{title}</h3>}
      {children}
    </section>
  );
}
