/**
 * Code Execution API Service
 * All API calls for running code, grading submissions, and fetching language info.
 */

import { apiClient } from '@/lib/apiClient';
import type {
  ExecutionResult,
  TestCaseResult,
  SubmissionResult,
  LanguageInfo,
} from '@/types/assessment';

const BASE = '/api/execute';

// ─── Run Code (sandbox) ──────────────────────────────────────

export const runCode = async (data: {
  sourceCode: string;
  language: string;
  stdin?: string;
}): Promise<ExecutionResult> => {
  const res = await apiClient.post<ExecutionResult>(`${BASE}/run`, data);
  return res.data;
};

// ─── Run Against Sample Test Cases ───────────────────────────

export const runAgainstSamples = async (data: {
  sourceCode: string;
  language: string;
  questionId: string;
}): Promise<{
  results: TestCaseResult[];
  passedCount: number;
  totalCount: number;
}> => {
  const res = await apiClient.post(`${BASE}/run-samples`, data);
  return res.data;
};

// ─── Submit Code for Grading ─────────────────────────────────

export const submitCode = async (data: {
  sessionId: string;
  questionId: string;
  sourceCode: string;
  language: string;
}): Promise<{
  submission: SubmissionResult;
  results: TestCaseResult[];
}> => {
  const res = await apiClient.post(`${BASE}/submit`, data);
  return res.data;
};

// ─── Get Supported Languages ─────────────────────────────────

export const getLanguages = async (): Promise<LanguageInfo[]> => {
  const res = await apiClient.get<{ languages: LanguageInfo[] }>(`${BASE}/languages`);
  return res.data.languages;
};

// ─── Get Starter Code ────────────────────────────────────────

export const getStarterCode = async (language: string): Promise<{
  language: string;
  languageId: number;
  monacoId: string;
  starterCode: string;
}> => {
  const res = await apiClient.get(`${BASE}/starter/${language}`);
  return res.data;
};

// ─── Judge0 Health Check ─────────────────────────────────────

export const checkHealth = async (): Promise<{
  healthy: boolean;
  version?: string;
  error?: string;
}> => {
  const res = await apiClient.get(`${BASE}/health`);
  return res.data;
};
