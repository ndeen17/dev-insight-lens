/**
 * PageHeader — Enterprise-standard dashboard page header.
 * Handles the mobile hamburger offset, responsive typography,
 * and optional action buttons in a consistent way.
 * 
 * Usage:
 *   <PageHeader
 *     title="Welcome back, John"
 *     subtitle="Track your projects and earnings"
 *     action={<Button>New Contract</Button>}
 *   />
 */

import { ReactNode } from 'react';

interface PageHeaderProps {
  /** Main page title */
  title: string;
  /** Optional subtitle / description */
  subtitle?: string | ReactNode;
  /** Optional right-side action (button, etc.) */
  action?: ReactNode;
  /** Optional className override */
  className?: string;
}

export default function PageHeader({ title, subtitle, action, className = '' }: PageHeaderProps) {
  return (
    <div className={`bg-white border-b border-gray-200 px-4 sm:px-8 py-5 sm:py-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-heading-sm sm:text-heading font-semibold text-gray-900 tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-body-sm text-gray-500 mt-0.5 truncate">
              {typeof subtitle === 'string' ? subtitle : subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
