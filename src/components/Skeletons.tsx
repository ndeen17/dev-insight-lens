/**
 * Skeleton primitives — shimmer-effect placeholders
 * Usage: <Skeleton className="h-4 w-32" />
 *        <SkeletonCard />   — generic card skeleton
 *        <SkeletonList />   — list of skeleton rows
 */
import { cn } from '@/lib/utils';

/* ── Base block ───────────────────────────────────────────── */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />;
}

/* ── Card skeleton (contract / assessment card) ───────────── */
export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-2 w-24 rounded-full" />
      </div>
    </div>
  );
}

/* ── Profile skeleton (TalentProfile / Settings) ──────────── */
export function SkeletonProfile() {
  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-start gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-3 mt-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="px-4 sm:px-8 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard skeleton (stat cards + list) ───────────────── */
export function SkeletonDashboard() {
  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
      {/* Stat cards */}
      <div className="px-4 sm:px-8 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
      {/* List */}
      <div className="px-4 sm:px-8 space-y-3">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

/* ── Leaderboard row skeleton ─────────────────────────────── */
export function SkeletonLeaderboardRow() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 flex items-center gap-4 sm:gap-6 animate-fade-in-up">
      <Skeleton className="w-10 sm:w-14 h-10 sm:h-14 rounded-full" />
      <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-3 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-5 w-14 rounded" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

/* ── Generic list of N skeleton cards ─────────────────────── */
export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
