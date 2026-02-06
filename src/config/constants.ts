/**
 * Application Constants
 * Centralized configuration values
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  TIMEOUT: 30000, // 30 seconds
} as const;

// Clerk Configuration
export const CLERK_CONFIG = {
  PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
} as const;

// Routes
export const ROUTES = {
  // Public routes
  HOME: '/',
  LEADERBOARD: '/leaderboard',
  
  // Auth routes
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',
  SIGN_UP_FREELANCER: '/auth/signup/freelancer',
  SIGN_UP_BUSINESS: '/auth/signup/business',
  VERIFY_EMAIL: '/auth/verify-email',
  EMAIL_VERIFIED: '/auth/email-verified',
  
  // Employer routes
  EMPLOYER_DASHBOARD: '/employer/dashboard',
  EMPLOYER_GETTING_STARTED: '/employer/getting-started',
  EMPLOYER_ONBOARDING: '/employer/onboarding',
  BROWSE_DEVELOPERS: '/employer/browse',
  SAVED_DEVELOPERS: '/employer/saved',
  TESTING_HUB: '/employer/tests',
  TEST_INVITATIONS: '/employer/tests/invitations',
  TEST_RESULTS: '/employer/tests/results',
  CREATE_CONTRACT: '/employer/contracts/create',
  CONTRACT_DETAILS: '/employer/contracts/:id',
  
  // Freelancer routes
  FREELANCER_DASHBOARD: '/freelancer/dashboard',
  TEST_SELECTION: '/freelancer/tests',
  TAKE_TEST: '/freelancer/tests/:id',
  TEST_RESULTS_VIEW: '/freelancer/tests/:id/results',
  CREATE_CONTRACT_FREELANCER: '/freelancer/contracts/create',
} as const;

// User Roles
export const USER_ROLES = {
  FREELANCER: 'Freelancer',
  BUSINESS_OWNER: 'BusinessOwner',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  EMPLOYER_REQUIREMENTS: 'employer_requirements',
  THEME: 'theme',
} as const;

// Retry Configuration
export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 5,
  DELAY_MS: 2000,
  TIMEOUT_MS: 10000,
} as const;

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_BIO_LENGTH: 500,
  MAX_COMPANY_NAME_LENGTH: 100,
} as const;
