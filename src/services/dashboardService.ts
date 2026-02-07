/**
 * Dashboard API Service
 * Fetches aggregated stats for the dashboard
 */

import { apiClient } from '@/lib/apiClient';
import type { DashboardStats } from '@/types/dashboard';

export const getDashboardStats = async () => {
  const res = await apiClient.get<DashboardStats>('/api/users/dashboard-stats');
  return res.data;
};
