/**
 * Talent Types
 * TypeScript interfaces for profession-based talent browsing
 */

export interface TalentProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  profession: string;
  professionalRole?: string;
  skills: string[];
  bio?: string;
  country?: string;
  githubUsername?: string;
  createdAt: string;
  // Aggregated assessment data
  bestScore: number | null;
  avgScore: number | null;
  assessmentCount: number;
}

export interface TalentAssessmentResult {
  _id: string;
  assessment: {
    _id: string;
    title: string;
    profession: string;
    difficulty: string;
    questionCount: number;
    timeLimitMinutes: number;
  };
  score: number | null;
  breakdown: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  timeSpentSeconds: number;
  completedAt: string;
}

export interface TalentProfileFull {
  profile: TalentProfile;
  assessments: TalentAssessmentResult[];
}

// ─── Freelancer Self-Profile (GET /api/users/me/full-profile) ─

export interface ProfileBadge {
  key: string;
  label: string;
  icon: string;
}

export interface FreelancerProfile extends TalentProfile {
  badges: ProfileBadge[];
}

export interface FreelancerSelfAssessment extends TalentAssessmentResult {
  assessment: TalentAssessmentResult['assessment'] & {
    assessmentType?: 'coding' | 'ai_chat';
    allowedLanguages?: string[];
    skills?: string[];
    createdBy?: {
      firstName: string;
      lastName: string;
      companyName?: string;
    };
  };
  status?: string;
}

export interface ActiveSession {
  _id: string;
  assessment: {
    _id: string;
    title: string;
    profession: string;
    difficulty: string;
    questionCount: number;
    timeLimitMinutes: number;
    assessmentType?: 'coding' | 'ai_chat';
  };
  startedAt: string;
  status: string;
}

export interface FreelancerFullProfile {
  profile: FreelancerProfile;
  assessments: FreelancerSelfAssessment[];
  activeSessions: ActiveSession[];
}

// ─── Public Assessment Catalog ────────────────────────────────

export interface PublicAssessment {
  _id: string;
  title: string;
  description: string;
  profession: string;
  skills: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questionCount: number;
  timeLimitMinutes: number;
  assessmentType: 'coding' | 'ai_chat';
  allowedLanguages: string[];
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    profilePicture?: string;
  };
  createdAt: string;
  completions: number;
  avgScore: number | null;
}

export interface PublicAssessmentsResponse {
  assessments: PublicAssessment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface BrowseTalentParams {
  profession?: string;
  skills?: string;
  search?: string;
  minScore?: number;
  sort?: 'score' | 'recent' | 'name';
  page?: number;
  limit?: number;
}

export interface BrowseTalentResponse {
  talent: TalentProfile[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Unified candidate type for the swipe-based Browse Talent experience.
 * Normalises both TalentProfile (assessment-based) and LeaderboardEntry (GitHub-based)
 * into a single shape the UI can render.
 */
export interface BrowseCandidate {
  id: string;
  /** 'talent' = assessment-verified user, 'developer' = GitHub leaderboard entry */
  type: 'talent' | 'developer';
  name: string;
  username?: string;
  avatar?: string;
  role: string;
  profession: string;
  location?: string;
  bio?: string;
  skills: string[];
  // Assessment data (talent)
  bestScore?: number | null;
  avgScore?: number | null;
  assessmentCount?: number;
  // GitHub data (developer)
  githubScore?: number;
  githubLevel?: string;
  primaryLanguages?: string[];
  githubUrl?: string;
  // Navigation helpers
  profileId?: string;
  email?: string;
}
