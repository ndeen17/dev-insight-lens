/**
 * Saved Developers API Service
 * Backend-persisted saved developers — replaces localStorage utility
 */

import { apiClient } from '@/lib/apiClient';

export interface SavedDeveloper {
  username: string;
  name: string;
  avatar: string | null;
  level: string | null;
  score: number | null;
  location: string | null;
  github_url: string | null;
  primary_languages: string[];
  skills: string[];
  type: 'talent' | 'developer';
  profileId: string | null;
  profession: string | null;
  savedAt: string | null;
}

interface GetSavedDevsResponse {
  savedDevelopers: SavedDeveloper[];
}

interface SaveDevResponse {
  message: string;
  savedDevelopers: string[];
}

interface RemoveDevResponse {
  message: string;
  savedDevelopers: string[];
}

const BASE = '/api/users/saved-developers';

/**
 * Fetch all saved developers with hydrated profile data
 */
export const getSavedDevelopers = async (): Promise<SavedDeveloper[]> => {
  const res = await apiClient.get<GetSavedDevsResponse>(BASE);
  return res.data.savedDevelopers;
};

/**
 * Save a developer by username (or profileId for talent)
 */
export const saveDeveloper = async (username: string): Promise<SaveDevResponse> => {
  const res = await apiClient.post<SaveDevResponse>(BASE, { username });
  return res.data;
};

/**
 * Remove a developer from saved list
 */
export const removeDeveloper = async (username: string): Promise<RemoveDevResponse> => {
  const res = await apiClient.delete<RemoveDevResponse>(`${BASE}/${encodeURIComponent(username)}`);
  return res.data;
};

/**
 * Get saved count (lightweight — returns full list length)
 */
export const getSavedCount = async (): Promise<number> => {
  const devs = await getSavedDevelopers();
  return devs.length;
};
