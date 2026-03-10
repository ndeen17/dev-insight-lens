/**
 * Assessment Types
 * TypeScript interfaces for the AI-powered and coding assessment system
 */

// ─── Assessment Template ──────────────────────────────────────

export type AssessmentDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type AssessmentType = 'coding' | 'ai_chat';
export type QuestionType = 'coding' | 'mcq';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface Assessment {
  _id: string;
  title: string;
  description: string;
  assessmentType: AssessmentType;
  profession: string;
  role: string;
  skills: string[];
  difficulty: AssessmentDifficulty;
  questionCount: number;
  timeLimitMinutes: number;
  questions: (Question | string)[];
  allowedLanguages: string[];
  inviteCode?: string;
  isPublic: boolean;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Question (Coding Challenge / MCQ) ────────────────────────

export interface TestCase {
  _id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation?: string;
}

export interface StarterCode {
  language: string;
  languageId: number;
  code: string;
}

export interface MCQOption {
  _id: string;
  text: string;
  isCorrect?: boolean; // hidden from candidates
}

export interface Question {
  _id: string;
  title: string;
  description: string;
  type: QuestionType;
  testCases: TestCase[];
  starterCode: StarterCode[];
  solutionCode?: string;
  allowedLanguages: string[];
  constraints: string;
  examples: string;
  options: MCQOption[];
  difficulty: QuestionDifficulty;
  points: number;
  category: string;
  tags: string[];
  timeLimitSeconds: number;
  createdBy: string;
  isPublic: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Code Execution ───────────────────────────────────────────

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  compileOutput: string;
  status: { id: number; description: string };
  executionTime: number | null;
  memoryUsed: number | null;
}

export interface TestCaseResult {
  testCaseId?: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  isHidden: boolean;
  executionTime: number | null;
  memoryUsed: number | null;
  error: string;
  statusDescription?: string;
}

export interface SubmissionResult {
  passedCount: number;
  totalCount: number;
  score: number;
  statusDescription: string;
}

export interface CodeSubmission {
  _id: string;
  question: string;
  code: string;
  language: string;
  languageId: number;
  testCaseResults: TestCaseResult[];
  passedCount: number;
  totalCount: number;
  score: number;
  statusDescription: string;
  executionTime: number;
  memoryUsed: number;
  aiReview: string;
  submittedAt: string;
}

export interface MCQAnswer {
  _id: string;
  question: string;
  selectedOptionId: string;
  isCorrect: boolean;
  answeredAt: string;
}

export interface AntiCheatEvent {
  event: string;
  timestamp: string;
  details?: string;
}

// ─── Language ─────────────────────────────────────────────────

export interface LanguageInfo {
  key: string;
  id: number;
  name: string;
  monacoId: string;
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
  sessionType: AssessmentType;
  status: SessionStatus;
  startedAt: string;
  completedAt: string | null;
  timeSpentSeconds: number;
  // AI chat fields
  messages: SessionMessage[];
  // Coding fields
  submissions: CodeSubmission[];
  mcqAnswers: MCQAnswer[];
  selectedLanguage: string;
  // Progress
  currentQuestionIndex: number;
  totalQuestions: number;
  // Results
  score: number | null;
  breakdown: Record<string, number>;
  aiSummary: string;
  strengths: string[];
  weaknesses: string[];
  // Anti-cheat
  antiCheatEvents: AntiCheatEvent[];
  antiCheatScore: number;
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
