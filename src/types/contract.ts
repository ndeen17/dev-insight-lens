/**
 * Contract & Milestone Types
 * Matches the backend Contract Mongoose model exactly
 */

export type ContractStatus =
  | 'draft'
  | 'pending'
  | 'active'
  | 'completed'
  | 'rejected'
  | 'disputed'
  | 'archived';

export type MilestoneStatus =
  | 'pending'
  | 'in-progress'
  | 'submitted'
  | 'approved'
  | 'paid'
  | 'rejected';

export type ContractType = 'fixed' | 'hourly';

export interface PopulatedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  companyName?: string;
}

export interface ActivityLogEntry {
  action: 'submitted' | 'approved' | 'changes_requested' | 'resubmitted' | 'payment_initiated' | 'payment_succeeded' | 'payment_failed';
  by: 'creator' | 'contributor' | 'system';
  message?: string;
  timestamp: string;
}

export interface ContractMilestone {
  name: string;
  budget: number;
  dueDate?: string;
  status: MilestoneStatus;
  submissionDetails?: string;
  submittedAt?: string;
  approvedAt?: string;
  order: number;
  // Payment fields
  paymentIntentId?: string;
  paidAt?: string;
  payoutAmount?: number;
  // Revision tracking
  revisionCount?: number;
  // Payment lifecycle
  paymentStatus?: 'none' | 'processing' | 'succeeded' | 'failed';
  paymentFailedAt?: string;
  paymentAttempts?: number;
  paymentError?: string;
  // Activity log
  activityLog?: ActivityLogEntry[];
}

export interface Contract {
  _id: string;
  contractName: string;
  creator: PopulatedUser;
  contributor?: PopulatedUser | null;
  contributorEmail: string;
  category: string;
  subcategory?: string;
  description: string;
  contractType: ContractType;
  // Fixed-price fields
  budget?: number;
  splitMilestones?: boolean;
  milestones?: ContractMilestone[];
  // Hourly fields
  hourlyRate?: number;
  hoursPerWeek?: number;
  weeklyLimit?: number;
  // Common fields
  currency: string;
  dueDate?: string;
  platformFee: number;
  status: ContractStatus;
  rejectionReason?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
