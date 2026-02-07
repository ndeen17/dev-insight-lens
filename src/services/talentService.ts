/**
 * Talent API Service
 * API calls for profession-based talent browsing
 */

import { apiClient } from '@/lib/apiClient';
import type {
  BrowseTalentParams,
  BrowseTalentResponse,
  TalentProfileFull,
} from '@/types/talent';

const BASE = '/api/users/talent';

export const browseTalent = async (params?: BrowseTalentParams) => {
  const res = await apiClient.get<BrowseTalentResponse>(BASE, { params });
  return res.data;
};

export const getTalentProfile = async (id: string) => {
  const res = await apiClient.get<TalentProfileFull>(`${BASE}/${id}`);
  return res.data;
};
