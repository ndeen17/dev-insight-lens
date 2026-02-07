/**
 * Assessment API Service
 * All API calls for the assessment system (invitations, sessions, templates)
 */

import { apiClient } from '@/lib/apiClient';
import type {
  Assessment,
  AssessmentInvitation,
  AssessmentSession,
  StartSessionResponse,
  SendMessageResponse,
} from '@/types/assessment';

const BASE = '/api/assessments';

// ─── Assessment Templates (employer) ─────────────────────────

export const createAssessment = async (data: Partial<Assessment>) => {
  const res = await apiClient.post<{ assessment: Assessment }>(BASE, data);
  return res.data.assessment;
};

export const getAssessments = async (params?: { page?: number; limit?: number; profession?: string }) => {
  const res = await apiClient.get<{
    assessments: Assessment[];
    total: number;
    page: number;
    limit: number;
  }>(BASE, { params });
  return res.data;
};

export const getAssessment = async (id: string) => {
  const res = await apiClient.get<{ assessment: Assessment }>(`${BASE}/${id}`);
  return res.data.assessment;
};

export const updateAssessment = async (id: string, data: Partial<Assessment>) => {
  const res = await apiClient.put<{ assessment: Assessment }>(`${BASE}/${id}`, data);
  return res.data.assessment;
};

export const deleteAssessment = async (id: string) => {
  await apiClient.delete(`${BASE}/${id}`);
};

// ─── Invitations ──────────────────────────────────────────────

export const sendInvitation = async (data: {
  assessmentId: string;
  freelancerEmail: string;
  message?: string;
  expiresInDays?: number;
}) => {
  const res = await apiClient.post<{ invitation: AssessmentInvitation }>(
    `${BASE}/invitations`,
    data
  );
  return res.data.invitation;
};

export const getInvitations = async (params?: { status?: string }) => {
  const res = await apiClient.get<{ invitations: AssessmentInvitation[] }>(
    `${BASE}/invitations`,
    { params }
  );
  return res.data.invitations;
};

export const getInvitationByToken = async (token: string) => {
  const res = await apiClient.get<{ invitation: AssessmentInvitation }>(
    `${BASE}/invitations/token/${token}`
  );
  return res.data.invitation;
};

export const declineInvitation = async (id: string) => {
  const res = await apiClient.patch<{ invitation: AssessmentInvitation }>(
    `${BASE}/invitations/${id}/decline`
  );
  return res.data.invitation;
};

// ─── Sessions ─────────────────────────────────────────────────

export const startSession = async (invitationId: string) => {
  const res = await apiClient.post<StartSessionResponse>(
    `${BASE}/sessions/start`,
    { invitationId }
  );
  return res.data;
};

export const getSession = async (id: string) => {
  const res = await apiClient.get<{ session: AssessmentSession }>(
    `${BASE}/sessions/${id}`
  );
  return res.data.session;
};

export const getSessions = async (params?: { status?: string; assessmentId?: string }) => {
  const res = await apiClient.get<{ sessions: AssessmentSession[] }>(
    `${BASE}/sessions`,
    { params }
  );
  return res.data.sessions;
};

export const sendMessage = async (sessionId: string, content: string) => {
  const res = await apiClient.post<SendMessageResponse>(
    `${BASE}/sessions/${sessionId}/message`,
    { content }
  );
  return res.data;
};
