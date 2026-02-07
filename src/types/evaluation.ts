/**
 * Type definitions for Dev-Insight-Lens evaluation system
 * Supports dual-mode analysis: Recruiter Mode & Engineer Mode
 */

export type SkillLevel = 'Entry' | 'Junior' | 'Mid-Level' | 'Senior' | 'Expert';
export type HiringRecommendation = 'Strong Hire' | 'Hire' | 'Consider' | 'Develop';

// Legacy compat aliases
export type LegacySkillLevel = 'Beginner' | 'Intermediate';
export type LegacyHiringRecommendation = 'Strong Yes' | 'Yes' | 'Maybe' | 'No';
export type ActivityFlag = 'Active' | 'Semi-active' | 'Inactive';
export type ProjectMaturityRating = 'Low' | 'Moderate' | 'Good' | 'Excellent';

/**
 * Profile metadata and identity
 */
export interface Profile {
  username: string;
  name: string;
  bio: string;
  avatar: string;
  location: string;
  github_url: string;
  primary_languages: string[];
  total_repositories: number;
  analyzed_repositories: number;
  activity_status: ActivityFlag;
}

/**
 * Scoring model - base metrics for both modes
 * Total possible: 100 points across 5 categories
 */
export interface Scores {
  overall_level: SkillLevel | string;
  overall_score: number; // 0-100
  max_score: number; // 100
  hiring_readiness: string;
  job_readiness_score: number; // 0-100
  tech_depth_score: number; // 0-100
  
  // 5-category scores
  code_sophistication: number; // 0-25
  engineering_practices: number; // 0-25
  project_maturity: number; // 0-20
  contribution_activity: number; // 0-15
  breadth_and_depth: number; // 0-15
}

/**
 * Recruiter Summary - High-level, hiring-focused insights
 * Designed for non-technical audience
 */
export interface RecruiterSummary {
  top_strengths: string[];
  risks_or_weaknesses: string[];
  recommended_role_level: string;
  hiring_readiness: string;
  hiring_recommendation?: string; // legacy alias
  project_maturity_rating: ProjectMaturityRating;
  portfolio_readiness?: string;
}

/**
 * Testing analysis structure
 */
export interface TestingAnalysis {
  test_presence: boolean;
  test_libraries_seen: string[];
  maturity?: string;
  details?: string;
  test_file_ratio?: number;
}

/**
 * Repository-level detailed analysis
 */
export interface RepoDetail {
  repo_name: string;
  score: number;
  notes: string;
  languages?: string[];
  complexity?: string;
  stars?: number;
  forks?: number;
}

/**
 * Language breakdown with proficiency
 */
export interface LanguageBreakdown {
  [language: string]: {
    percentage: number;
    repos_count: number;
    proficiency_level?: string;
  };
}

/**
 * Engineer Breakdown - Deep technical analysis
 * Designed for technical audience
 */
export interface EngineerBreakdown {
  code_patterns: string[];
  architecture_analysis: string[];
  testing_analysis: TestingAnalysis;
  complexity_insights: string[];
  commit_message_quality: string;
  language_breakdown: LanguageBreakdown;
  repo_level_details: RepoDetail[];
  notable_implementations?: string[];
  improvement_areas?: string[];
  interview_probes?: string[];
}

/**
 * Complete evaluation response from backend
 * Contains all data needed for both Recruiter and Engineer modes
 */
export interface EvaluationResponse {
  profile: Profile;
  scores: Scores;
  recruiter_summary: RecruiterSummary;
  engineer_breakdown: EngineerBreakdown;
  leaderboard_submitted?: boolean;
  leaderboard_error?: string;
}

/**
 * Legacy format support (for backward compatibility)
 */
export interface LegacyEvaluationResponse {
  grade: SkillLevel;
  reasoning: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  analyzedRepos: number;
  totalRepos: number;
}

/**
 * Type guard to check if response is new format
 */
export function isNewFormat(data: any): data is EvaluationResponse {
  return data && 'profile' in data && 'scores' in data && 'recruiter_summary' in data;
}

/**
 * Type guard to check if response is legacy format
 */
export function isLegacyFormat(data: any): data is LegacyEvaluationResponse {
  return data && 'grade' in data && 'reasoning' in data && 'strengths' in data;
}
