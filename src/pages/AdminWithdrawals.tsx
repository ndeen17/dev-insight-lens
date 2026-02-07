import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowDownToLine,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Types ─────────────────────────────────────────────────────

interface WithdrawalUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

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
  user: WithdrawalUser;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  withdrawalInfo: WithdrawalInfo;
  adminNote?: string;
  externalReference?: string;
  processedBy?: WithdrawalUser | null;
  processedAt?: string;
  createdAt: string;
}

// ─── Component ─────────────────────────────────────────────────

const AdminWithdrawals = () => {
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Processing state
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [externalRef, setExternalRef] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchWithdrawals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter) params.append('status', statusFilter);
      const res = await apiClient.get(`/api/payments/admin/withdrawals?${params}`);
      setWithdrawals(res.data.withdrawals || []);
      setTotal(res.data.total || 0);
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.error || 'Failed to load withdrawals', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, toast]);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  const handleProcess = async (withdrawalId: string, status: 'completed' | 'rejected' | 'processing') => {
    setProcessingId(withdrawalId);
    try {
      await apiClient.patch(`/api/payments/admin/withdrawals/${withdrawalId}`, {
        status,
        adminNote: adminNote.trim() || undefined,
        externalReference: externalRef.trim() || undefined,
      });
      toast({ title: 'Success', description: `Withdrawal marked as ${status}` });
      setAdminNote('');
      setExternalRef('');
      setExpandedId(null);
      await fetchWithdrawals();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to process withdrawal', variant: 'destructive' });
    } finally {
      setProcessingId(null);
    }
  };

  const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
    pending: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: <Clock className="w-4 h-4" />, label: 'Pending' },
    processing: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: <Loader2 className="w-4 h-4 animate-spin" />, label: 'Processing' },
    completed: { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: <CheckCircle2 className="w-4 h-4" />, label: 'Completed' },
    rejected: { color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: <XCircle className="w-4 h-4" />, label: 'Rejected' },
  };

  const filters = ['pending', 'processing', 'completed', 'rejected', ''];
  const filterLabels: Record<string, string> = { pending: 'Pending', processing: 'Processing', completed: 'Completed', rejected: 'Rejected', '': 'All' };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-sm sm:text-heading font-semibold text-gray-900 tracking-tight">Withdrawal Management</h1>
            <p className="text-sm text-gray-500 mt-1">Review and process freelancer withdrawal requests</p>
          </div>
          <button
            onClick={fetchWithdrawals}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => { setStatusFilter(f); setPage(1); }}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === f
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>

        {/* Withdrawals List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ArrowDownToLine className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p>No {statusFilter || ''} withdrawals found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {withdrawals.map((w) => {
              const config = statusConfig[w.status];
              const isExpanded = expandedId === w._id;

              return (
                <div key={w._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  {/* Summary Row */}
                  <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 cursor-pointer hover:bg-gray-50 transition-colors gap-3"
                    onClick={() => setExpandedId(isExpanded ? null : w._id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.bg} ${config.color}`}>
                        {config.icon}
                        {config.label}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {w.user.firstName} {w.user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{w.user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-subheading text-gray-900">
                        {w.currency} {w.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-4">
                      {/* Bank Details */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Bank Details</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className="text-gray-400">Bank</span>
                            <p className="font-medium">{w.withdrawalInfo.bankName}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Account Name</span>
                            <p className="font-medium">{w.withdrawalInfo.accountName}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Account Number</span>
                            <p className="font-medium">{w.withdrawalInfo.accountNumber}</p>
                          </div>
                          {w.withdrawalInfo.routingNumber && (
                            <div>
                              <span className="text-gray-400">Routing</span>
                              <p className="font-medium">{w.withdrawalInfo.routingNumber}</p>
                            </div>
                          )}
                          {w.withdrawalInfo.bankCountry && (
                            <div>
                              <span className="text-gray-400">Country</span>
                              <p className="font-medium">{w.withdrawalInfo.bankCountry}</p>
                            </div>
                          )}
                          {w.withdrawalInfo.additionalInfo && (
                            <div className="col-span-2">
                              <span className="text-gray-400">Additional Info</span>
                              <p className="font-medium">{w.withdrawalInfo.additionalInfo}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Admin Note (existing) */}
                      {w.adminNote && (
                        <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm">
                          <span className="text-gray-400">Admin Note:</span> {w.adminNote}
                        </div>
                      )}

                      {/* Process Actions */}
                      {(w.status === 'pending' || w.status === 'processing') && (
                        <div className="space-y-3 pt-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Admin Note (optional)</label>
                              <input
                                type="text"
                                value={expandedId === w._id ? adminNote : ''}
                                onChange={(e) => setAdminNote(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                placeholder="e.g. Sent via bank transfer #12345"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">External Reference (optional)</label>
                              <input
                                type="text"
                                value={expandedId === w._id ? externalRef : ''}
                                onChange={(e) => setExternalRef(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                placeholder="e.g. TXN-ABC123"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {w.status === 'pending' && (
                              <button
                                onClick={() => handleProcess(w._id, 'processing')}
                                disabled={processingId === w._id}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                              >
                                {processingId === w._id ? 'Processing...' : 'Mark Processing'}
                              </button>
                            )}
                            <button
                              onClick={() => handleProcess(w._id, 'completed')}
                              disabled={processingId === w._id}
                              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                              {processingId === w._id ? 'Processing...' : 'Mark Completed'}
                            </button>
                            <button
                              onClick={() => handleProcess(w._id, 'rejected')}
                              disabled={processingId === w._id}
                              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                              {processingId === w._id ? 'Processing...' : 'Reject'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Processed info */}
                      {w.processedAt && (
                        <p className="text-xs text-gray-400">
                          Processed on {new Date(w.processedAt).toLocaleString()}
                          {w.processedBy && ` by ${w.processedBy.firstName} ${w.processedBy.lastName}`}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {total > limit && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * limit >= total}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWithdrawals;
