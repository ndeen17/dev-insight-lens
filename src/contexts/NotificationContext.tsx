/**
 * Notification Context
 * Manages Socket.io connection, real-time notifications, and notification state.
 * Provides hooks for the rest of the app to access notifications & unread count.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { API_CONFIG } from '@/config/constants';
import { logger } from '@/utils/logger';
import type { Notification, NotificationPage } from '@/types/notification';
import { playNotificationSound, getSoundEnabled, setSoundEnabled } from '@/utils/notificationSound';

interface NotificationContextType {
  /** Live array of loaded notifications (newest first) */
  notifications: Notification[];
  /** Number of unread notifications */
  unreadCount: number;
  /** Whether the initial fetch is in progress */
  loading: boolean;
  /** Socket connection status */
  connected: boolean;
  /** Mark a single notification as read */
  markAsRead: (notificationId: string) => Promise<void>;
  /** Mark all notifications as read */
  markAllAsRead: () => Promise<void>;
  /** Load more (older) notifications */
  loadMore: () => Promise<void>;
  /** Whether there are more pages to load */
  hasMore: boolean;
  /** Delete a notification */
  deleteNotification: (notificationId: string) => Promise<void>;
  /** Whether notification sounds are enabled */
  soundEnabled: boolean;
  /** Toggle notification sound on/off */
  toggleSound: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { getToken } = useClerkAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [soundEnabled, setSoundEnabledState] = useState(getSoundEnabled);
  const soundEnabledRef = useRef(soundEnabled);

  // Keep ref in sync so socket handler always has latest value
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      setSoundEnabled(next);
      return next;
    });
  }, []);

  // ── Socket.io connection management ────────────────────

  useEffect(() => {
    if (!isAuthenticated || !user?._id) {
      // Cleanup if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setNotifications([]);
      setUnreadCount(0);
      setConnected(false);
      setLoading(false);
      return;
    }

    const connectSocket = async () => {
      try {
        const token = await getToken();
        if (!token) {
          logger.warn('No token available for socket connection');
          return;
        }

        // Don't create duplicate connections
        if (socketRef.current?.connected) return;

        // Disconnect existing stale socket
        if (socketRef.current) {
          socketRef.current.disconnect();
        }

        const socket = io(API_CONFIG.BASE_URL, {
          auth: { token },
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 2000,
          reconnectionDelayMax: 30000,
          timeout: 20000,
        });

        socket.on('connect', () => {
          logger.info('Socket connected');
          setConnected(true);

          // Request unread count on connect / reconnect
          socket.emit('notification:getUnreadCount', (response: { count: number }) => {
            setUnreadCount(response.count);
          });
        });

        socket.on('disconnect', (reason) => {
          logger.debug('Socket disconnected:', reason);
          setConnected(false);
        });

        socket.on('connect_error', (error) => {
          logger.error('Socket connect error:', error.message);
          setConnected(false);
        });

        // ── Real-time events ──────────────────────
        socket.on('notification:new', (notification: Notification) => {
          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
          // Play chime if sound is enabled
          if (soundEnabledRef.current) {
            playNotificationSound();
          }
        });

        socket.on('notification:unreadCount', ({ count }: { count: number }) => {
          setUnreadCount(count);
        });

        socketRef.current = socket;
      } catch (error) {
        logger.error('Failed to establish socket connection', error);
      }
    };

    connectSocket();

    // Cleanup on unmount or auth change
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, user?._id, getToken]);

  // ── Initial fetch via REST ────────────────────────────

  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    const fetchInitialNotifications = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<NotificationPage>('/api/notifications', {
          params: { page: 1, limit: 20 },
        });

        const data = response.data;
        setNotifications(data.notifications);
        setHasMore(data.page < data.totalPages);
        setPage(1);
      } catch (error) {
        logger.error('Failed to fetch notifications', error);
      } finally {
        setLoading(false);
      }
    };

    // Also fetch unread count via REST as fallback
    const fetchUnreadCount = async () => {
      try {
        const response = await apiClient.get<{ count: number }>('/api/notifications/unread-count');
        setUnreadCount(response.data.count);
      } catch (error) {
        logger.error('Failed to fetch unread count', error);
      }
    };

    fetchInitialNotifications();
    fetchUnreadCount();
  }, [isAuthenticated, user?._id]);

  // ── Actions ───────────────────────────────────────────

  const markAsRead = useCallback(async (notificationId: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === notificationId ? { ...n, read: true, readAt: new Date().toISOString() } : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      // Use socket if connected, otherwise REST
      if (socketRef.current?.connected) {
        socketRef.current.emit('notification:markRead', { notificationId });
      } else {
        await apiClient.patch(`/api/notifications/${notificationId}/read`);
      }
    } catch (error) {
      logger.error('Failed to mark notification as read', error);
      // Revert optimistic update would require refetch — acceptable trade-off
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const previousNotifications = notifications;
    const previousCount = unreadCount;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true, readAt: new Date().toISOString() }))
    );
    setUnreadCount(0);

    try {
      if (socketRef.current?.connected) {
        socketRef.current.emit('notification:markAllRead');
      } else {
        await apiClient.patch('/api/notifications/read-all');
      }
    } catch (error) {
      logger.error('Failed to mark all as read', error);
      // Revert optimistic update
      setNotifications(previousNotifications);
      setUnreadCount(previousCount);
    }
  }, [notifications, unreadCount]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      const nextPage = page + 1;
      const response = await apiClient.get<NotificationPage>('/api/notifications', {
        params: { page: nextPage, limit: 20 },
      });

      const data = response.data;
      setNotifications((prev) => [...prev, ...data.notifications]);
      setHasMore(data.page < data.totalPages);
      setPage(nextPage);
    } catch (error) {
      logger.error('Failed to load more notifications', error);
    }
  }, [hasMore, loading, page]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    const notification = notifications.find((n) => n._id === notificationId);

    // Optimistic removal
    setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      await apiClient.delete(`/api/notifications/${notificationId}`);
    } catch (error) {
      logger.error('Failed to delete notification', error);
    }
  }, [notifications]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    connected,
    markAsRead,
    markAllAsRead,
    loadMore,
    hasMore,
    deleteNotification,
    soundEnabled,
    toggleSound,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
