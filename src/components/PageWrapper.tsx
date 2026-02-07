import { ReactNode } from 'react';

/**
 * Wraps page content with a subtle fade-in + slide-up entrance animation.
 * Every page should use this as its outermost content wrapper.
 */
export default function PageWrapper({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`animate-page-enter ${className}`}>
      {children}
    </div>
  );
}
