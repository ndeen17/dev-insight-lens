/**
 * Common TypeScript Types
 * Shared type definitions across the application
 */

// User Types
export type UserRole = 'Freelancer' | 'BusinessOwner';

export interface User {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  country?: string;
  companyName?: string;
  githubUsername?: string;
  profilePicture?: string;
  bio?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  savedDevelopers?: string[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Contract Types
export interface Contract {
  _id: string;
  title: string;
  description: string;
  employerId: string;
  freelancerId?: string;
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled';
  budget: number;
  currency: string;
  deadline?: string;
  requirements: Requirement[];
  milestones?: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'approved';
  completedAt?: string;
}

// Test Types
export interface Test {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // in minutes
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'code' | 'essay';
  options?: string[];
  correctAnswer?: string | number;
  points: number;
}

export interface TestInvitation {
  id: string;
  testId: string;
  candidateEmail: string;
  emailVerified: boolean;
  status: 'pending' | 'completed' | 'expired';
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  completedAt?: string;
}

export interface TestResult {
  id: string;
  testId: string;
  userId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  answers: TestAnswer[];
  completedAt: string;
  duration: number; // actual time taken in minutes
}

export interface TestAnswer {
  questionId: string;
  answer: string | number | string[];
  isCorrect: boolean;
  points: number;
}

// GitHub Analysis Types
export interface GitHubProfile {
  username: string;
  name: string;
  bio: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubAnalysis {
  profile: GitHubProfile;
  repositories: Repository[];
  languages: LanguageStats;
  contributionStats: ContributionStats;
  score: DeveloperScore;
}

export interface Repository {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updated_at: string;
  url: string;
}

export interface LanguageStats {
  [language: string]: number; // percentage
}

export interface ContributionStats {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  consistencyScore: number;
}

export interface DeveloperScore {
  overall: number;
  codeQuality: number;
  activity: number;
  collaboration: number;
  specialization: number;
}

// Leaderboard Types
export interface LeaderboardEntry {
  _id: string;
  githubUsername: string;
  score: number;
  rank: number;
  analyzedAt: string;
  profile: {
    name: string;
    avatar_url: string;
    bio: string;
  };
  topLanguages: string[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Form Types
export interface SignUpFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  country?: string;
  companyName?: string;
}

export interface ContractFormData {
  title: string;
  description: string;
  budget: number;
  currency: string;
  deadline?: string;
  requirements: Omit<Requirement, 'id'>[];
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter Types
export interface DeveloperFilters {
  languages?: string[];
  minScore?: number;
  maxScore?: number;
  location?: string;
  availability?: 'available' | 'busy' | 'all';
}

export interface ContractFilters {
  status?: Contract['status'][];
  minBudget?: number;
  maxBudget?: number;
  dateRange?: {
    start: string;
    end: string;
  };
}
