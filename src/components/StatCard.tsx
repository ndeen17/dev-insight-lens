/**
 * StatCard — Reusable stat/metric card for dashboards.
 * Consistent with enterprise design patterns (Stripe, PayPal).
 */

import { ReactNode } from 'react';

interface StatCardProps {
  /** Metric label */
  label: string;
  /** Primary value (number or formatted string) */
  value: string | number;
  /** Optional secondary text below value */
  sub?: string;
  /** Icon element */
  icon: ReactNode;
  /** Background color class for icon container */
  bg?: string;
  /** Show loading skeleton */
  loading?: boolean;
  /** Animation delay index for stagger */
  index?: number;
}

export default function StatCard({ label, value, sub, icon, bg = 'bg-blue-50', loading = false, index = 0 }: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-20" />
            <div className="h-6 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 animate-scale-in hover:shadow-sm transition-shadow"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-caption text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-heading-sm font-semibold text-gray-900 mt-0.5 truncate">
          {value}
        </p>
        {sub && (
          <p className="text-caption text-gray-400 mt-0.5 truncate">{sub}</p>
        )}
      </div>
    </div>
  );
}
