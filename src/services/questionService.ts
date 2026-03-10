/**
 * Question API Service
 * CRUD operations for coding challenges and MCQ questions.
 */

import { apiClient } from '@/lib/apiClient';
import type { Question } from '@/types/assessment';

const BASE = '/api/questions';

// ─── Create Question ─────────────────────────────────────────

export const createQuestion = async (data: Partial<Question>): Promise<Question> => {
  const res = await apiClient.post<{ question: Question }>(BASE, data);
  return res.data.question;
};

// ─── Get Questions (paginated, filterable) ───────────────────

export const getQuestions = async (params?: {
  type?: string;
  difficulty?: string;
  category?: string;
  tag?: string;
  search?: string;
  isPublic?: string;
  page?: number;
  limit?: number;
}): Promise<{
  questions: Question[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const res = await apiClient.get(BASE, { params });
  return res.data;
};

// ─── Get Single Question ─────────────────────────────────────

export const getQuestion = async (id: string): Promise<Question> => {
  const res = await apiClient.get<{ question: Question }>(`${BASE}/${id}`);
  return res.data.question;
};

// ─── Update Question ─────────────────────────────────────────

export const updateQuestion = async (id: string, data: Partial<Question>): Promise<Question> => {
  const res = await apiClient.put<{ question: Question }>(`${BASE}/${id}`, data);
  return res.data.question;
};

// ─── Delete Question ─────────────────────────────────────────

export const deleteQuestion = async (id: string): Promise<void> => {
  await apiClient.delete(`${BASE}/${id}`);
};

// ─── Get Categories ──────────────────────────────────────────

export const getCategories = async (): Promise<string[]> => {
  const res = await apiClient.get<{ categories: string[] }>(`${BASE}/categories`);
  return res.data.categories;
};
