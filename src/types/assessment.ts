/**
 * Assessment Types
 * TypeScript interfaces for the AI-powered assessment system
 */

// ─── Assessment Template ──────────────────────────────────────

export type AssessmentDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Assessment {
  _id: string;
  title: string;
  description: string;
  profession: string;
  role: string;
  skills: string[];
  difficulty: AssessmentDifficulty;
  questionCount: number;
  timeLimitMinutes: number;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Invitation ───────────────────────────────────────────────

export type InvitationStatus = 'pending' | 'accepted' | 'completed' | 'expired' | 'declined';

export interface AssessmentInvitation {
  _id: string;
  assessment: Assessment | string;
  employer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    companyName?: string;
  } | string;
  freelancer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profession?: string;
  } | string | null;
  freelancerEmail: string;
  status: InvitationStatus;
  inviteToken: string;
  expiresAt: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Session ──────────────────────────────────────────────────

export type SessionStatus = 'in_progress' | 'completed' | 'timed_out' | 'abandoned';

export interface SessionMessage {
  _id: string;
  role: 'ai' | 'user';
  content: string;
  questionIndex: number | null;
  timestamp: string;
}

export interface AssessmentSession {
  _id: string;
  invitation: string;
  assessment: Assessment | string;
  freelancer: string;
  status: SessionStatus;
  startedAt: string;
  completedAt: string | null;
  timeSpentSeconds: number;
  messages: SessionMessage[];
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number | null;
  breakdown: Record<string, number>;
  aiSummary: string;
  strengths: string[];
  weaknesses: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── API Response Shapes ──────────────────────────────────────

export interface SendMessageResponse {
  session: AssessmentSession;
  evaluation: string;
  score: number;
  nextQuestion: string | null;
  isComplete: boolean;
}

export interface StartSessionResponse {
  session: AssessmentSession;
  resumed: boolean;
}
