/**
 * Notification Types
 * Shared type definitions for the notification system
 */

export type NotificationType =
  | 'contract_invitation'
  | 'contract_accepted'
  | 'contract_rejected'
  | 'contract_completed'
  | 'contract_updated'
  | 'milestone_submitted'
  | 'milestone_approved'
  | 'milestone_rejected'
  | 'milestone_paid'
  | 'payment_receipt'
  | 'payment_failed'
  | 'payment_delayed'
  | 'withdrawal_requested'
  | 'withdrawal_processing'
  | 'withdrawal_completed'
  | 'withdrawal_rejected'
  | 'system_announcement';

export interface Notification {
  _id: string;
  recipient: string;
  type: NotificationType;
  title: string;
  message: string;
  contract?: string;
  actor?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  } | null;
  actionUrl?: string | null;
  read: boolean;
  readAt?: string | null;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPage {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
