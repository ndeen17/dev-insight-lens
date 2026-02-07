/**
 * Common TypeScript Types
 * Shared type definitions across the application
 */

// User Types
export type UserRole = 'Freelancer' | 'BusinessOwner' | 'Admin';

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
  profession?: string;
  professionalRole?: string;
  skills?: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  savedDevelopers?: string[];
  balance?: number;
  totalEarnings?: number;
  stripeCustomerId?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Contract Types — re-exported from dedicated file
import type { ContractStatus as _ContractStatus } from './contract';
export type {
  ContractStatus,
  MilestoneStatus,
  ContractType,
  PopulatedUser,
  ContractMilestone,
  Contract,
} from './contract';

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
  contractName: string;
  description: string;
  contractType: 'fixed' | 'hourly';
  budget?: number;
  hourlyRate?: number;
  currency: string;
  dueDate?: string;
  contributorEmail: string;
  category: string;
  subcategory?: string;
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
  status?: _ContractStatus[];
  minBudget?: number;
  maxBudget?: number;
  dateRange?: {
    start: string;
    end: string;
  };
}
