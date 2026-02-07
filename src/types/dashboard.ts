/**
 * Dashboard Stats Types
 * Matches backend GET /api/users/dashboard-stats response
 */

export interface RecentContract {
  _id: string;
  contractName: string;
  status: string;
  budget?: number;
  contractType: string;
  contributorEmail?: string;
  createdAt: string;
  contributor?: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  };
  creator?: {
    firstName: string;
    lastName: string;
    email: string;
    companyName?: string;
    profilePicture?: string;
  };
}

export interface RecentSession {
  _id: string;
  score: number;
  completedAt: string;
  freelancer: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    profession?: string;
  };
  assessment: {
    title: string;
    profession: string;
    difficulty: string;
  };
}

export interface EmployerDashboardStats {
  role: 'BusinessOwner';
  contracts: {
    total: number;
    active: number;
    pending: number;
    completed: number;
    totalBudget: number;
  };
  assessments: {
    created: number;
    invitationsSent: number;
  };
  recentContracts: RecentContract[];
  recentSessions: RecentSession[];
}

export interface FreelancerDashboardStats {
  role: 'Freelancer';
  contracts: {
    total: number;
    active: number;
    pending: number;
    completed: number;
    totalEarnings: number;
  };
  assessments: {
    completed: number;
    bestScore: number | null;
    avgScore: number | null;
  };
  recentContracts: RecentContract[];
}

export type DashboardStats = EmployerDashboardStats | FreelancerDashboardStats;
