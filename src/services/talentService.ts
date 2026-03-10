/**
 * Talent API Service
 * API calls for profession-based talent browsing
 */

import { apiClient } from '@/lib/apiClient';
import type {
  BrowseTalentParams,
  BrowseTalentResponse,
  TalentProfileFull,
  FreelancerFullProfile,
  PublicAssessmentsResponse,
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

// ─── Freelancer Self-Profile ──────────────────────────────────

export const getMyFullProfile = async () => {
  const res = await apiClient.get<FreelancerFullProfile>('/api/users/me/full-profile');
  return res.data;
};

// ─── Public Assessment Catalog ────────────────────────────────

export const getPublicAssessments = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  profession?: string;
  difficulty?: string;
  assessmentType?: string;
  sort?: string;
}) => {
  const res = await apiClient.get<PublicAssessmentsResponse>('/api/assessments/public', { params });
  return res.data;
};
