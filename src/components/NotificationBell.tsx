/**
 * NotificationBell
 * Renders a bell icon with an unread badge.
 * On click, opens a dropdown panel with the notification list.
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  Bell,
  Check,
  CheckCheck,
  FileText,
  CircleCheck,
  CircleX,
  Trophy,
  ClipboardCheck,
  ClipboardX,
  Megaphone,
  Loader2,
  X,
  DollarSign,
  AlertTriangle,
  Receipt,
  Clock,
  Wallet,
  ArrowDownToLine,
  XCircle,
  GraduationCap,
  UserX,
  PlayCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { Notification, NotificationType } from '@/types/notification';

// ── Icon / color map ────────────────────────────────────

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string }> = {
  contract_invitation: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
  contract_accepted: { icon: CircleCheck, color: 'text-green-600', bg: 'bg-green-100' },
  contract_rejected: { icon: CircleX, color: 'text-red-500', bg: 'bg-red-100' },
  contract_completed: { icon: Trophy, color: 'text-lime-600', bg: 'bg-lime-100' },
  contract_updated: { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-100' },
  milestone_submitted: { icon: ClipboardCheck, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  milestone_approved: { icon: Check, color: 'text-green-600', bg: 'bg-green-100' },
  milestone_rejected: { icon: ClipboardX, color: 'text-orange-500', bg: 'bg-orange-100' },
  milestone_paid: { icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  payment_receipt: { icon: Receipt, color: 'text-blue-600', bg: 'bg-blue-100' },
  payment_failed: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  payment_delayed: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  withdrawal_requested: { icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-100' },
  withdrawal_processing: { icon: ArrowDownToLine, color: 'text-blue-600', bg: 'bg-blue-100' },
  withdrawal_completed: { icon: CircleCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  withdrawal_rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  assessment_invitation: { icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-100' },
  assessment_declined: { icon: UserX, color: 'text-orange-500', bg: 'bg-orange-100' },
  assessment_started: { icon: PlayCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
  assessment_completed: { icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-100' },
  system_announcement: { icon: Megaphone, color: 'text-gray-700', bg: 'bg-gray-100' },
};

function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

// ── Single notification row ─────────────────────────────

function NotificationItem({
  notification,
  onRead,
  onNavigate,
}: {
  notification: Notification;
  onRead: (id: string) => void;
  onNavigate: (url: string) => void;
}) {
  const config = typeConfig[notification.type] || typeConfig.system_announcement;
  const Icon = config.icon;

  const handleClick = () => {
    if (!notification.read) onRead(notification._id);
    if (notification.actionUrl) onNavigate(notification.actionUrl);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
        !notification.read ? 'bg-blue-50/60' : ''
      }`}
    >
      {/* Icon */}
      <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${config.bg}`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
        <p className="text-[11px] text-gray-400 mt-1">{timeAgo(notification.createdAt)}</p>
      </div>

      {/* Unread dot */}
      {!notification.read && (
        <span className="mt-2 flex-shrink-0 w-2 h-2 rounded-full bg-blue-500" />
      )}
    </button>
  );
}

// ── Main component ──────────────────────────────────────

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    loadMore,
    hasMore,
    soundEnabled,
    toggleSound,
  } = useNotifications();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleNavigate = (url: string) => {
    navigate(url);
    setOpen(false);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <>
          {/* Backdrop overlay */}
          <div className="fixed inset-0 bg-black/20 z-[60]" onClick={() => setOpen(false)} />
          
          {/* Panel - always fixed, centered on mobile, top-right on desktop */}
          <div className="fixed z-[61] inset-x-3 top-4 sm:inset-auto sm:top-4 sm:right-4 sm:w-[400px] max-h-[calc(100vh-2rem)] bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                aria-label={soundEnabled ? 'Mute notifications' : 'Unmute notifications'}
                title={soundEnabled ? 'Sound on' : 'Sound off'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-blue-600" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Bell className="w-8 h-8 mb-2" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <>
                {notifications.map((n) => (
                  <NotificationItem
                    key={n._id}
                    notification={n}
                    onRead={markAsRead}
                    onNavigate={handleNavigate}
                  />
                ))}

                {/* Load more */}
                {hasMore && (
                  <button
                    onClick={loadMore}
                    className="w-full py-3 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Load older notifications
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
}
