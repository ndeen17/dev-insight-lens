/**
 * Payment Types
 * Shared types for payment methods, withdrawals, and Stripe integration
 */

// ─── Payment Methods ───────────────────────────────────────────

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface SetupIntentResponse {
  clientSecret: string;
}

// ─── Milestone Payments ────────────────────────────────────────

export interface PayMilestoneResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}

export interface MilestonePaymentStatus {
  paymentStatus: 'none' | 'processing' | 'succeeded' | 'failed';
  stripeStatus?: string;
  paymentIntentId: string | null;
  amount?: number;
  currency?: string;
  paidAt: string | null;
  paymentAttempts: number;
  paymentError: string | null;
}

// ─── Balance & Withdrawals ─────────────────────────────────────

export interface BalanceInfo {
  balance: number;
  totalEarnings: number;
  withdrawalInfo: WithdrawalInfo | null;
}

export interface WithdrawalInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber?: string;
  bankCountry?: string;
  currency?: string;
  additionalInfo?: string;
}

export interface Withdrawal {
  _id: string;
  user: string | { _id: string; firstName: string; lastName: string; email: string };
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  withdrawalInfo: WithdrawalInfo;
  adminNote?: string;
  processedBy?: string | { _id: string; firstName: string; lastName: string; email: string };
  processedAt?: string;
  externalReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalListResponse {
  withdrawals: Withdrawal[];
  total: number;
  page: number;
  limit: number;
}
