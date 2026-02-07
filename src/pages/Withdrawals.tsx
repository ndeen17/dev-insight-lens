import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import {
  Wallet,
  Building2,
  ArrowDownToLine,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────

interface WithdrawalInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber?: string;
  bankCountry?: string;
  currency?: string;
  additionalInfo?: string;
}

interface Withdrawal {
  _id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  withdrawalInfo: WithdrawalInfo;
  adminNote?: string;
  processedAt?: string;
  createdAt: string;
}

// ─── Component ─────────────────────────────────────────────────

const Withdrawals = () => {
  const { toast } = useToast();

  // State
  const [balance, setBalance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [withdrawalInfo, setWithdrawalInfo] = useState<WithdrawalInfo>({
    bankName: '',
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    bankCountry: '',
    currency: 'USD',
    additionalInfo: '',
  });
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingInfo, setSavingInfo] = useState(false);
  const [requestingWithdrawal, setRequestingWithdrawal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showBankForm, setShowBankForm] = useState(false);

  // ── Fetch data ─────────────────────────────────────────────

  const fetchBalance = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/payments/balance');
      setBalance(res.data.balance || 0);
      setTotalEarnings(res.data.totalEarnings || 0);
      if (res.data.withdrawalInfo) {
        setWithdrawalInfo((prev) => ({ ...prev, ...res.data.withdrawalInfo }));
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  }, []);

  const fetchWithdrawals = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/payments/withdrawals');
      setWithdrawals(res.data.withdrawals || []);
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchBalance(), fetchWithdrawals()]);
      setLoading(false);
    };
    load();
  }, [fetchBalance, fetchWithdrawals]);

  // ── Save bank info ─────────────────────────────────────────

  const handleSaveBankInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawalInfo.bankName || !withdrawalInfo.accountName || !withdrawalInfo.accountNumber) {
      toast({ title: 'Missing fields', description: 'Bank name, account name and account number are required.', variant: 'destructive' });
      return;
    }
    setSavingInfo(true);
    try {
      await apiClient.put('/api/payments/withdrawal-info', withdrawalInfo);
      toast({ title: 'Saved', description: 'Your bank details have been updated.' });
      setShowBankForm(false);
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to save bank details.', variant: 'destructive' });
    } finally {
      setSavingInfo(false);
    }
  };

  // ── Request withdrawal ─────────────────────────────────────

  const handleRequestWithdrawal = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast({ title: 'Invalid amount', description: 'Enter a valid withdrawal amount.', variant: 'destructive' });
      return;
    }
    if (amount > balance) {
      toast({ title: 'Insufficient balance', description: `Your available balance is $${balance.toFixed(2)}.`, variant: 'destructive' });
      return;
    }

    setRequestingWithdrawal(true);
    try {
      await apiClient.post('/api/payments/withdraw', { amount });
      toast({ title: 'Withdrawal requested', description: `$${amount.toFixed(2)} withdrawal has been submitted for review.` });
      setWithdrawAmount('');
      // Refresh data
      await Promise.all([fetchBalance(), fetchWithdrawals()]);
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to request withdrawal.', variant: 'destructive' });
    } finally {
      setRequestingWithdrawal(false);
    }
  };

  // ── Status helpers ─────────────────────────────────────────

  const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    pending: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: <Clock className="w-4 h-4" /> },
    processing: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: <Loader2 className="w-4 h-4 animate-spin" /> },
    completed: { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: <CheckCircle2 className="w-4 h-4" /> },
    rejected: { color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: <XCircle className="w-4 h-4" /> },
  };

  const hasBankInfo = withdrawalInfo.bankName && withdrawalInfo.accountName && withdrawalInfo.accountNumber;
  const hasPendingWithdrawal = withdrawals.some((w) => w.status === 'pending' || w.status === 'processing');

  // ── Loading state ──────────────────────────────────────────

  if (loading) {
    return (
      <DashboardLayout userRole="Freelancer">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="Freelancer">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-6">
        <h1 className="text-heading-sm sm:text-heading font-semibold text-gray-900 tracking-tight">Withdrawals</h1>
        <p className="text-body-sm text-gray-500 mt-0.5">Manage your earnings and request payouts</p>
      </div>

      <div className="px-4 sm:px-8 py-6 space-y-6">
        {/* ── Balance Cards ──────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Available Balance */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Available Balance</span>
            </div>
            <p className="text-display-sm font-bold text-blue-900">${balance.toFixed(2)}</p>
          </div>

          {/* Total Earnings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <ArrowDownToLine className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-500">Total Earned</span>
            </div>
            <p className="text-display-sm font-bold text-gray-900">${totalEarnings.toFixed(2)}</p>
          </div>

          {/* Withdrawn */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-500">Total Withdrawn</span>
            </div>
            <p className="text-display-sm font-bold text-gray-900">
              ${(totalEarnings - balance).toFixed(2)}
            </p>
          </div>
        </div>

        {/* ── Bank Details Section ───────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gray-700" />
              <h2 className="text-subheading text-gray-900">Bank Details</h2>
            </div>
            <button
              onClick={() => setShowBankForm(!showBankForm)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {hasBankInfo ? 'Edit' : 'Add Bank Details'}
            </button>
          </div>

          {hasBankInfo && !showBankForm ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Bank Name</span>
                <p className="font-medium text-gray-900">{withdrawalInfo.bankName}</p>
              </div>
              <div>
                <span className="text-gray-500">Account Name</span>
                <p className="font-medium text-gray-900">{withdrawalInfo.accountName}</p>
              </div>
              <div>
                <span className="text-gray-500">Account Number</span>
                <p className="font-medium text-gray-900">
                  ****{withdrawalInfo.accountNumber.slice(-4)}
                </p>
              </div>
              {withdrawalInfo.routingNumber && (
                <div>
                  <span className="text-gray-500">Routing Number</span>
                  <p className="font-medium text-gray-900">{withdrawalInfo.routingNumber}</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSaveBankInfo} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
                  <input
                    type="text"
                    value={withdrawalInfo.bankName}
                    onChange={(e) => setWithdrawalInfo((p) => ({ ...p, bankName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Chase Bank"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Name *</label>
                  <input
                    type="text"
                    value={withdrawalInfo.accountName}
                    onChange={(e) => setWithdrawalInfo((p) => ({ ...p, accountName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
                  <input
                    type="text"
                    value={withdrawalInfo.accountNumber}
                    onChange={(e) => setWithdrawalInfo((p) => ({ ...p, accountNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Account number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Routing Number</label>
                  <input
                    type="text"
                    value={withdrawalInfo.routingNumber || ''}
                    onChange={(e) => setWithdrawalInfo((p) => ({ ...p, routingNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Country</label>
                  <input
                    type="text"
                    value={withdrawalInfo.bankCountry || ''}
                    onChange={(e) => setWithdrawalInfo((p) => ({ ...p, bankCountry: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. US"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <input
                    type="text"
                    value={withdrawalInfo.currency || 'USD'}
                    onChange={(e) => setWithdrawalInfo((p) => ({ ...p, currency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="USD"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Info</label>
                <textarea
                  value={withdrawalInfo.additionalInfo || ''}
                  onChange={(e) => setWithdrawalInfo((p) => ({ ...p, additionalInfo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Any additional details (e.g. SWIFT / IBAN)"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={savingInfo}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {savingInfo ? 'Saving...' : 'Save Bank Details'}
                </button>
                {hasBankInfo && (
                  <button
                    type="button"
                    onClick={() => setShowBankForm(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* ── Request Withdrawal ─────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-subheading text-gray-900 mb-4">Request Withdrawal</h2>

          {!hasBankInfo ? (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">Bank details required</p>
                <p className="text-sm text-amber-700 mt-0.5">
                  Please add your bank details above before requesting a withdrawal.
                </p>
              </div>
            </div>
          ) : hasPendingWithdrawal ? (
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">Withdrawal in progress</p>
                <p className="text-sm text-blue-700 mt-0.5">
                  You already have a pending or processing withdrawal. Please wait for it to complete before requesting another.
                </p>
              </div>
            </div>
          ) : balance <= 0 ? (
            <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <Wallet className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-600">No funds available</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Your balance will be credited once milestone payments are processed.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (max: ${balance.toFixed(2)})
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={balance}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(balance.toFixed(2))}
                    className="px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Max
                  </button>
                </div>
              </div>
              <button
                onClick={handleRequestWithdrawal}
                disabled={requestingWithdrawal || !withdrawAmount}
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {requestingWithdrawal ? 'Requesting...' : 'Request Withdrawal'}
              </button>
              <p className="text-xs text-gray-500">
                Withdrawals are reviewed and processed manually by our team. You'll be notified once completed.
              </p>
            </div>
          )}
        </div>

        {/* ── Withdrawal History ──────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-subheading text-gray-900">Withdrawal History</h2>
            <button
              onClick={() => { fetchBalance(); fetchWithdrawals(); }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {withdrawals.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No withdrawals yet</p>
          ) : (
            <div className="space-y-3">
              {withdrawals.map((w) => {
                const config = statusConfig[w.status] || statusConfig.pending;
                return (
                  <div
                    key={w._id}
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 rounded-lg border ${config.bg}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={config.color}>{config.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">${w.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(w.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium capitalize ${config.color}`}>{w.status}</span>
                      {w.adminNote && (
                        <p className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">{w.adminNote}</p>
                      )}
                      {w.processedAt && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Processed {new Date(w.processedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Withdrawals;
