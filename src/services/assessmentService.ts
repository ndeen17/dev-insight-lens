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

// ─── Question Management on Assessments ───────────────────────

export const addQuestionsToAssessment = async (assessmentId: string, questionIds: string[]) => {
  const res = await apiClient.post<{ assessment: Assessment }>(
    `${BASE}/${assessmentId}/questions`,
    { questionIds }
  );
  return res.data.assessment;
};

export const removeQuestionFromAssessment = async (assessmentId: string, questionId: string) => {
  const res = await apiClient.delete<{ assessment: Assessment }>(
    `${BASE}/${assessmentId}/questions/${questionId}`
  );
  return res.data.assessment;
};

export const reorderAssessmentQuestions = async (assessmentId: string, questionIds: string[]) => {
  const res = await apiClient.put<{ assessment: Assessment }>(
    `${BASE}/${assessmentId}/questions/reorder`,
    { questionIds }
  );
  return res.data.assessment;
};

export const regenerateInviteCode = async (assessmentId: string) => {
  const res = await apiClient.post<{ inviteCode: string }>(
    `${BASE}/${assessmentId}/regenerate-code`
  );
  return res.data.inviteCode;
};

export const getAssessmentByInviteCode = async (inviteCode: string) => {
  const res = await apiClient.get<{ assessment: Assessment }>(
    `${BASE}/code/${inviteCode}`
  );
  return res.data.assessment;
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

export const finishCodingSession = async (sessionId: string) => {
  const res = await apiClient.post<{ session: AssessmentSession }>(
    `${BASE}/sessions/${sessionId}/finish`
  );
  return res.data.session;
};

export const recordAntiCheatEvent = async (
  sessionId: string,
  event: string,
  details?: string
) => {
  const res = await apiClient.post<{ recorded: boolean; antiCheatScore: number; totalEvents: number }>(
    `${BASE}/sessions/${sessionId}/anti-cheat`,
    { event, details }
  );
  return res.data;
};

export const joinByInviteCode = async (inviteCode: string) => {
  const res = await apiClient.post<{ invitation: AssessmentInvitation; assessment: Assessment }>(
    `${BASE}/join/${inviteCode}`
  );
  return res.data;
};
