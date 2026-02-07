/**
 * Payment Service
 * Centralised API calls for payment methods, milestone payments,
 * balance & withdrawals.
 */

import { apiClient } from '@/lib/apiClient';
import type {
  PaymentMethod,
  SetupIntentResponse,
  PayMilestoneResponse,
  MilestonePaymentStatus,
  BalanceInfo,
  WithdrawalInfo,
  Withdrawal,
  WithdrawalListResponse,
} from '@/types/payment';

// ─── Payment Methods ───────────────────────────────────────────

/** Create a Stripe SetupIntent so the user can save a card */
export async function createSetupIntent(): Promise<SetupIntentResponse> {
  const { data } = await apiClient.post<SetupIntentResponse>('/api/payments/setup-intent');
  return data;
}

/** List saved payment methods for the current user */
export async function listPaymentMethods(): Promise<PaymentMethod[]> {
  const { data } = await apiClient.get<{ methods: PaymentMethod[] }>('/api/payments/methods');
  return data.methods;
}

// ─── Milestone Payments ────────────────────────────────────────

/** Pay an approved milestone */
export async function payMilestone(
  contractId: string,
  milestoneIndex: number,
  paymentMethodId?: string,
): Promise<PayMilestoneResponse> {
  const { data } = await apiClient.post<PayMilestoneResponse>(
    `/api/payments/milestones/${contractId}/${milestoneIndex}/pay`,
    paymentMethodId ? { paymentMethodId } : {},
  );
  return data;
}

/** Retry a failed milestone payment */
export async function retryMilestonePayment(
  contractId: string,
  milestoneIndex: number,
  paymentMethodId?: string,
): Promise<PayMilestoneResponse> {
  const { data } = await apiClient.post<PayMilestoneResponse>(
    `/api/payments/milestones/${contractId}/${milestoneIndex}/retry`,
    paymentMethodId ? { paymentMethodId } : {},
  );
  return data;
}

/** Poll milestone payment status */
export async function getMilestonePaymentStatus(
  contractId: string,
  milestoneIndex: number,
): Promise<MilestonePaymentStatus> {
  const { data } = await apiClient.get<MilestonePaymentStatus>(
    `/api/payments/milestones/${contractId}/${milestoneIndex}/status`,
  );
  return data;
}

// ─── Balance & Withdrawals ─────────────────────────────────────

export async function getBalance(): Promise<BalanceInfo> {
  const { data } = await apiClient.get<BalanceInfo>('/api/payments/balance');
  return data;
}

export async function updateWithdrawalInfo(info: WithdrawalInfo): Promise<void> {
  await apiClient.put('/api/payments/withdrawal-info', info);
}

export async function requestWithdrawal(amount: number): Promise<{ withdrawal: Withdrawal; newBalance: number }> {
  const { data } = await apiClient.post('/api/payments/withdraw', { amount });
  return data;
}

export async function getWithdrawals(page = 1, limit = 20): Promise<WithdrawalListResponse> {
  const { data } = await apiClient.get<WithdrawalListResponse>('/api/payments/withdrawals', {
    params: { page, limit },
  });
  return data;
}

// ─── Admin Withdrawals ─────────────────────────────────────────

export async function adminGetWithdrawals(
  params: { status?: string; page?: number; limit?: number } = {},
): Promise<WithdrawalListResponse> {
  const { data } = await apiClient.get<WithdrawalListResponse>('/api/payments/admin/withdrawals', { params });
  return data;
}

export async function adminProcessWithdrawal(
  withdrawalId: string,
  body: { status: string; adminNote?: string; externalReference?: string },
): Promise<{ withdrawal: Withdrawal }> {
  const { data } = await apiClient.patch(`/api/payments/admin/withdrawals/${withdrawalId}`, body);
  return data;
}
