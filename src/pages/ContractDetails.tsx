import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { apiClient } from '@/lib/apiClient';
import { ROUTES } from '@/config/constants';
import type { Contract, ActivityLogEntry } from '@/types/contract';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { SkeletonProfile } from '@/components/Skeletons';
import {
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Calendar,
  User,
  AlertCircle,
  Upload,
  Download,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  Layers,
  Flag,
  XCircle,
  Building2,
  Archive,
  MessageSquare,
  RefreshCw,
  CreditCard,
  Send,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

/* ── Helpers ────────────────────────────────── */
const fmtCurrency = (v: number, cur: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: cur }).format(v);

const fmtDate = (d?: string) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const fmtDateTime = (d?: string) => {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

/* ── Component ──────────────────────────────── */
export default function ContractDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Milestone submission state
  const [submissionDetails, setSubmissionDetails] = useState('');
  const [selectedMilestoneIdx, setSelectedMilestoneIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  // Custom message state
  const [message, setMessage] = useState('');

  // Complete / Archive state
  const [completingContract, setCompletingContract] = useState(false);
  const [archivingContract, setArchivingContract] = useState(false);
  const [payingMilestone, setPayingMilestone] = useState<number | null>(null);
  const [retryingPayment, setRetryingPayment] = useState<number | null>(null);
  const [expandedActivityLog, setExpandedActivityLog] = useState<number | null>(null);

  const isCreator = useMemo(
    () => user && contract?.creator?._id === user._id,
    [user, contract]
  );
  const isContributor = useMemo(
    () =>
      user &&
      (contract?.contributor?._id === user._id ||
        contract?.contributorEmail === user.email),
    [user, contract]
  );

  const dashboardRoute = useMemo(() => {
    if (!user) return ROUTES.HOME;
    return user.role === 'BusinessOwner'
      ? ROUTES.EMPLOYER_DASHBOARD
      : ROUTES.FREELANCER_DASHBOARD;
  }, [user]);

  /* ── Fetch contract ──────────────────────── */
  const fetchContract = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await apiClient.get(`/api/contracts/${id}`);
      setContract(res.data.contract);
    } catch (err: any) {
      setError(
        err.response?.status === 403
          ? 'You are not authorized to view this contract.'
          : err.response?.status === 404
          ? 'Contract not found.'
          : 'Failed to load contract.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  // Real-time refresh: refetch when a contract-related notification arrives
  const { notifications } = useNotifications();
  useEffect(() => {
    const latest = notifications[0];
    if (
      latest &&
      [
        'contract_accepted',
        'contract_rejected',
        'contract_completed',
        'milestone_submitted',
        'milestone_approved',
        'milestone_rejected',
        'milestone_paid',
        'payment_failed',
        'payment_receipt',
        'payment_delayed',
      ].includes(latest.type)
    ) {
      fetchContract();
    }
  }, [notifications, fetchContract]);

  /* ── Milestone actions ───────────────────── */
  const handleSubmitMilestone = async (milestoneIndex: number) => {
    if (!submissionDetails.trim()) return;
    try {
      setSubmitting(true);
      await apiClient.patch(
        `/api/contracts/${id}/milestones/${milestoneIndex}/status`,
        {
          status: 'submitted',
          submissionDetails: submissionDetails.trim(),
          message: message.trim() || undefined,
        }
      );
      setSubmissionDetails('');
      setMessage('');
      setSelectedMilestoneIdx(null);
      await fetchContract();
    } catch {
      setError('Failed to submit milestone.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveMilestone = async (milestoneIndex: number) => {
    try {
      setSubmitting(true);
      const res = await apiClient.patch(
        `/api/contracts/${id}/milestones/${milestoneIndex}/status`,
        {
          status: 'approved',
          feedback: feedback || undefined,
          message: message.trim() || feedback || undefined,
        }
      );
      setFeedback('');
      setMessage('');

      // Show payment result info
      const payment = res.data?.payment;
      if (payment?.status === 'no_payment_method') {
        setError('Milestone approved! Please add a payment method to pay the contributor.');
      } else if (payment?.status === 'failed') {
        setError(`Milestone approved but auto-payment failed: ${payment.reason}. You can retry from the milestone.`);
      }

      await fetchContract();
    } catch {
      setError('Failed to approve milestone.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectMilestone = async (milestoneIndex: number) => {
    if (!feedback.trim()) return;
    try {
      setSubmitting(true);
      await apiClient.patch(
        `/api/contracts/${id}/milestones/${milestoneIndex}/status`,
        { status: 'rejected', feedback: feedback.trim() }
      );
      setFeedback('');
      setMessage('');
      await fetchContract();
    } catch {
      setError('Failed to reject milestone.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetryPayment = async (milestoneIndex: number) => {
    try {
      setRetryingPayment(milestoneIndex);
      await apiClient.post(
        `/api/payments/milestones/${id}/${milestoneIndex}/retry`,
        {}
      );
      await fetchContract();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Retry failed. Please try again.';
      setError(msg);
    } finally {
      setRetryingPayment(null);
    }
  };

  const handlePayMilestone = async (milestoneIndex: number) => {
    try {
      setPayingMilestone(milestoneIndex);
      const res = await apiClient.post(
        `/api/payments/milestones/${id}/${milestoneIndex}/pay`,
        {}
      );
      // Payment intent created — for now we auto-confirm server-side
      // In future, use Stripe Elements with res.data.clientSecret
      await fetchContract();
    } catch (err: any) {
      const msg =
        err.response?.data?.message || 'Payment failed. Please try again.';
      setError(msg);
    } finally {
      setPayingMilestone(null);
    }
  };

  /* ── Contract-level actions ──────────────── */
  const handleCompleteContract = async () => {
    try {
      setCompletingContract(true);
      await apiClient.patch(`/api/contracts/${id}/status`, { status: 'completed' });
      await fetchContract();
    } catch {
      setError('Failed to complete contract.');
    } finally {
      setCompletingContract(false);
    }
  };

  const handleArchiveContract = async () => {
    try {
      setArchivingContract(true);
      await apiClient.patch(`/api/contracts/${id}/status`, { status: 'archived' });
      await fetchContract();
    } catch {
      setError('Failed to archive contract.');
    } finally {
      setArchivingContract(false);
    }
  };

  /* ── Computed values ─────────────────────── */
  const amount = useMemo(() => {
    if (!contract) return '';
    return contract.contractType === 'fixed'
      ? fmtCurrency(contract.budget || 0, contract.currency)
      : `${fmtCurrency(contract.hourlyRate || 0, contract.currency)}/hr`;
  }, [contract]);

  const platformFeeAmt = useMemo(() => {
    if (!contract) return '';
    const base =
      contract.contractType === 'fixed'
        ? contract.budget || 0
        : (contract.hourlyRate || 0) * (contract.hoursPerWeek || 0);
    return fmtCurrency(base * (contract.platformFee / 100), contract.currency);
  }, [contract]);

  const progress = useMemo(() => {
    if (!contract?.milestones?.length) return 0;
    const done = contract.milestones.filter(
      (m) => m.status === 'approved' || m.status === 'paid'
    ).length;
    return Math.round((done / contract.milestones.length) * 100);
  }, [contract]);

  const otherPartyName = useMemo(() => {
    if (!contract) return '';
    if (isCreator) {
      return contract.contributor
        ? `${contract.contributor.firstName} ${contract.contributor.lastName}`
        : contract.contributorEmail;
    }
    const c = contract.creator;
    return c.companyName
      ? `${c.firstName} ${c.lastName} (${c.companyName})`
      : `${c.firstName} ${c.lastName}`;
  }, [contract, isCreator]);

  /* ── Status helpers ──────────────────────── */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'disputed': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'archived': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getMilestoneStatusBadge = (status: string) => {
    const map: Record<string, { color: string; label: string; Icon: any }> = {
      pending: { color: 'bg-gray-100 text-gray-600', label: 'Pending', Icon: Clock },
      'in-progress': { color: 'bg-blue-100 text-blue-700', label: 'In Progress', Icon: Clock },
      submitted: { color: 'bg-yellow-100 text-yellow-700', label: 'Submitted', Icon: Upload },
      approved: { color: 'bg-green-100 text-green-700', label: 'Approved', Icon: CheckCircle2 },
      paid: { color: 'bg-lime-100 text-lime-700', label: 'Paid', Icon: DollarSign },
      rejected: { color: 'bg-red-100 text-red-700', label: 'Changes Requested', Icon: XCircle },
    };
    const cfg = map[status] || map.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${cfg.color}`}>
        <cfg.Icon className="w-3 h-3" /> {cfg.label}
      </span>
    );
  };

  /* ── Loading / Error states ──────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-3xl w-full">
          <SkeletonProfile />
        </div>
      </div>
    );
  }

  if (error && !contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-xl shadow-sm p-8 animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load</h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <Button variant="outline" onClick={() => navigate(dashboardRoute)} className="active:scale-[0.97] transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!contract) return null;

  /* ── Main render ─────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(dashboardRoute)}
            className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
          </button>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(
              contract.status
            )}`}
          >
            {contract.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* Inline error alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {contract.contractName}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                {contract.category}
                {contract.subcategory ? ` / ${contract.subcategory}` : ''}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Created {fmtDate(contract.createdAt)}
              </span>
              {contract.dueDate && (
                <span className="flex items-center gap-1">
                  <Flag className="w-3.5 h-3.5" />
                  Due {fmtDate(contract.dueDate)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Main column ──────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-lime-600" /> Contract Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {contract.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">
                      Type
                    </h3>
                    <p className="text-gray-900 capitalize">
                      {contract.contractType === 'fixed'
                        ? 'Fixed Price'
                        : 'Hourly Rate'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">
                      {contract.contractType === 'fixed'
                        ? 'Budget'
                        : 'Hourly Rate'}
                    </h3>
                    <p className="text-gray-900 font-semibold">{amount}</p>
                  </div>
                </div>

                {/* Rejection reason */}
                {contract.status === 'rejected' && contract.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-2">
                    <p className="text-sm font-semibold text-red-700 mb-1">
                      Decline Reason
                    </p>
                    <p className="text-sm text-red-600">
                      {contract.rejectionReason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Milestones card */}
            {contract.milestones && contract.milestones.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Milestones</CardTitle>
                  <CardDescription>
                    Track progress and manage deliverables
                  </CardDescription>
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Overall Progress</span>
                      <span className="font-semibold">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...contract.milestones]
                    .sort((a, b) => a.order - b.order)
                    .map((milestone, idx) => {
                      const milestoneIndex = contract.milestones!.findIndex(
                        (m) => m.order === milestone.order
                      );
                      const canSubmit =
                        isContributor &&
                        contract.status === 'active' &&
                        ['pending', 'in-progress', 'rejected'].includes(
                          milestone.status
                        );
                      const canReview =
                        isCreator && milestone.status === 'submitted';

                      return (
                        <Card
                          key={idx}
                          className="border"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-lime-100 text-lime-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                  {idx + 1}
                                </span>
                                <div>
                                  <CardTitle className="text-base">
                                    {milestone.name}
                                  </CardTitle>
                                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                    <span className="flex items-center">
                                      <DollarSign className="w-3.5 h-3.5 mr-0.5" />
                                      {fmtCurrency(
                                        milestone.budget,
                                        contract.currency
                                      )}
                                    </span>
                                    {milestone.dueDate && (
                                      <span className="flex items-center">
                                        <Calendar className="w-3.5 h-3.5 mr-0.5" />
                                        {fmtDate(milestone.dueDate)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {getMilestoneStatusBadge(milestone.status)}
                            </div>
                            {/* Revision count badge */}
                            {(milestone.revisionCount ?? 0) > 0 && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                                {milestone.revisionCount} revision{(milestone.revisionCount ?? 0) > 1 ? 's' : ''}
                              </span>
                            )}
                            {/* Payment status indicator */}
                            {milestone.paymentStatus === 'processing' && (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                                <Loader2 className="w-3 h-3 animate-spin" /> Processing Payment
                              </span>
                            )}
                            {milestone.paymentStatus === 'failed' && (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                                <AlertCircle className="w-3 h-3" /> Payment Failed
                              </span>
                            )}
                          </CardHeader>

                          {/* Submission details */}
                          {milestone.submissionDetails && (
                            <CardContent className="pt-0 space-y-3">
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm font-semibold mb-1">
                                  Submission
                                </p>
                                <p className="text-sm text-gray-700">
                                  {milestone.submissionDetails}
                                </p>
                                {milestone.submittedAt && (
                                  <p className="text-xs text-gray-400 mt-2">
                                    Submitted {fmtDate(milestone.submittedAt)}
                                  </p>
                                )}
                              </div>
                            </CardContent>
                          )}

                          {/* Creator review actions */}
                          {canReview && (
                            <CardContent className="pt-0 space-y-3 border-t">
                              <Textarea
                                placeholder="Feedback (required for rejection)..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={3}
                              />
                              <Textarea
                                placeholder="Optional message to include in the notification email..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={2}
                                className="text-sm"
                              />
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                  onClick={() =>
                                    handleApproveMilestone(milestoneIndex)
                                  }
                                  disabled={submitting}
                                  className="flex-1 bg-lime-500 hover:bg-lime-600 text-black font-bold"
                                >
                                  {submitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                  ) : (
                                    <CreditCard className="w-4 h-4 mr-1" />
                                  )}
                                  Approve & Pay
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    handleRejectMilestone(milestoneIndex)
                                  }
                                  disabled={submitting || !feedback.trim()}
                                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  Request Changes
                                </Button>
                              </div>
                            </CardContent>
                          )}

                          {/* Contributor submit work */}
                          {canSubmit && selectedMilestoneIdx === milestoneIndex && (
                            <CardContent className="pt-0 space-y-3 border-t">
                              <Textarea
                                placeholder="Describe your completed work and deliverables…"
                                value={submissionDetails}
                                onChange={(e) =>
                                  setSubmissionDetails(e.target.value)
                                }
                                rows={4}
                              />
                              <Textarea
                                placeholder="Optional message to the reviewer..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={2}
                                className="text-sm"
                              />
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                  onClick={() =>
                                    handleSubmitMilestone(milestoneIndex)
                                  }
                                  disabled={
                                    submitting || !submissionDetails.trim()
                                  }
                                  className="flex-1 bg-lime-500 hover:bg-lime-600 text-black font-bold"
                                >
                                  {submitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                  ) : (
                                    <Send className="w-4 h-4 mr-1" />
                                  )}
                                  {milestone.status === 'rejected' ? 'Resubmit Milestone' : 'Submit Milestone'}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedMilestoneIdx(null);
                                    setSubmissionDetails('');
                                    setMessage('');
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </CardContent>
                          )}

                          {canSubmit && selectedMilestoneIdx !== milestoneIndex && (
                            <CardContent className="pt-0">
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() =>
                                  setSelectedMilestoneIdx(milestoneIndex)
                                }
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                {milestone.status === 'rejected' ? 'Resubmit Work' : 'Submit Work'}
                              </Button>
                            </CardContent>
                          )}

                          {/* Pay Milestone (creator only, after approval, no auto-pay) */}
                          {isCreator && milestone.status === 'approved' && (!milestone.paymentIntentId || milestone.paymentStatus === 'failed') && (
                            <CardContent className="pt-0 border-t space-y-2">
                              {/* Payment error message */}
                              {milestone.paymentStatus === 'failed' && milestone.paymentError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                  <p className="text-sm font-semibold text-red-700 mb-1">Payment Failed</p>
                                  <p className="text-xs text-red-600">{milestone.paymentError}</p>
                                  {milestone.paymentAttempts && (
                                    <p className="text-xs text-red-500 mt-1">Attempts: {milestone.paymentAttempts}</p>
                                  )}
                                </div>
                              )}
                              <Button
                                className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold"
                                disabled={payingMilestone === milestoneIndex || retryingPayment === milestoneIndex}
                                onClick={() => milestone.paymentStatus === 'failed' ? handleRetryPayment(milestoneIndex) : handlePayMilestone(milestoneIndex)}
                              >
                                {(payingMilestone === milestoneIndex || retryingPayment === milestoneIndex) ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : milestone.paymentStatus === 'failed' ? (
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                ) : (
                                  <CreditCard className="w-4 h-4 mr-2" />
                                )}
                                {milestone.paymentStatus === 'failed' ? 'Retry Payment' : `Pay ${fmtCurrency(milestone.budget, contract.currency)}`}
                              </Button>
                              <p className="text-xs text-gray-500 text-center">
                                Platform fee: {contract.platformFee}% · Payout:{' '}
                                {fmtCurrency(
                                  milestone.budget * (1 - contract.platformFee / 100),
                                  contract.currency
                                )}
                              </p>
                            </CardContent>
                          )}

                          {/* Payment processing indicator */}
                          {milestone.paymentStatus === 'processing' && milestone.status !== 'paid' && (
                            <CardContent className="pt-0 border-t">
                              <div className="flex flex-wrap items-center justify-between gap-2 bg-blue-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-blue-700">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span className="text-sm font-semibold">Payment Processing</span>
                                </div>
                                <p className="text-sm font-semibold text-blue-700">
                                  {fmtCurrency(milestone.budget, contract.currency)}
                                </p>
                              </div>
                            </CardContent>
                          )}

                          {/* Paid confirmation */}
                          {milestone.status === 'paid' && (
                            <CardContent className="pt-0 border-t">
                              <div className="flex flex-wrap items-center justify-between gap-2 bg-lime-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-lime-700">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span className="text-sm font-semibold">Payment Complete</span>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-lime-700">
                                    {fmtCurrency(milestone.budget, contract.currency)}
                                  </p>
                                  {milestone.paidAt && (
                                    <p className="text-xs text-gray-500">{fmtDate(milestone.paidAt)}</p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          )}

                          {/* Activity Log */}
                          {milestone.activityLog && milestone.activityLog.length > 0 && (
                            <CardContent className="pt-0 border-t">
                              <button
                                onClick={() => setExpandedActivityLog(expandedActivityLog === milestoneIndex ? null : milestoneIndex)}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 w-full py-1"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Activity ({milestone.activityLog.length})</span>
                                {expandedActivityLog === milestoneIndex ? (
                                  <ChevronUp className="w-3.5 h-3.5 ml-auto" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 ml-auto" />
                                )}
                              </button>
                              {expandedActivityLog === milestoneIndex && (
                                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                                  {milestone.activityLog.map((entry: ActivityLogEntry, logIdx: number) => (
                                    <div key={logIdx} className={`flex gap-3 text-sm p-2 rounded-lg ${
                                      entry.by === 'creator' ? 'bg-blue-50' :
                                      entry.by === 'contributor' ? 'bg-green-50' : 'bg-gray-50'
                                    }`}>
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                                        entry.by === 'creator' ? 'bg-blue-200 text-blue-700' :
                                        entry.by === 'contributor' ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-600'
                                      }`}>
                                        {entry.by === 'system' ? '⚡' : entry.by === 'creator' ? 'C' : 'F'}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-gray-700 capitalize">{entry.action.replace(/_/g, ' ')}</span>
                                          <span className="text-xs text-gray-400">{fmtDateTime(entry.timestamp)}</span>
                                        </div>
                                        {entry.message && (
                                          <p className="text-gray-600 mt-0.5 text-sm">{entry.message}</p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          )}
                        </Card>
                      );
                    })}
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── Sidebar ──────────────────────── */}
          <div className="lg:col-span-1 space-y-6">
            {/* Parties */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contract Parties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Creator */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    {contract.creator.role === 'BusinessOwner'
                      ? 'Client'
                      : 'Sender'}
                  </h3>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {contract.creator.companyName ? (
                        <Building2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <User className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">
                        {contract.creator.firstName}{' '}
                        {contract.creator.lastName}
                      </p>
                      {contract.creator.companyName && (
                        <p className="text-sm text-gray-500">
                          {contract.creator.companyName}
                        </p>
                      )}
                      <p className="text-sm text-gray-400 truncate">
                        {contract.creator.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Contributor
                  </h3>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      {contract.contributor ? (
                        <>
                          <p className="font-medium text-gray-900">
                            {contract.contributor.firstName}{' '}
                            {contract.contributor.lastName}
                          </p>
                          <p className="text-sm text-gray-400 truncate">
                            {contract.contributor.email}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-gray-900">
                            Pending Signup
                          </p>
                          <p className="text-sm text-gray-400 truncate">
                            {contract.contributorEmail}
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Invitation sent — awaiting account creation
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-lime-600" /> Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Contract Value</span>
                  <span className="font-semibold">{amount}</span>
                </div>

                {contract.contractType === 'hourly' && (
                  <>
                    {contract.hoursPerWeek && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hours / Week</span>
                        <span>{contract.hoursPerWeek}</span>
                      </div>
                    )}
                    {contract.weeklyLimit && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Weekly Limit</span>
                        <span>
                          {fmtCurrency(contract.weeklyLimit, contract.currency)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-gray-600">
                    Platform Fee ({contract.platformFee}%)
                  </span>
                  <span>{platformFeeAmt}</span>
                </div>

                {/* Milestone payment breakdown */}
                {contract.milestones && contract.milestones.length > 0 && (
                  <>
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="text-lime-600 font-medium">Paid</span>
                      <span className="font-semibold text-lime-600">
                        {fmtCurrency(
                          contract.milestones
                            .filter((m) => m.status === 'paid')
                            .reduce((s, m) => s + m.budget, 0),
                          contract.currency
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Approved (unpaid)</span>
                      <span className="font-semibold text-green-600">
                        {fmtCurrency(
                          contract.milestones
                            .filter((m) => m.status === 'approved')
                            .reduce((s, m) => s + m.budget, 0),
                          contract.currency
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining</span>
                      <span className="font-semibold">
                        {fmtCurrency(
                          contract.milestones
                            .filter(
                              (m) =>
                                m.status !== 'approved' && m.status !== 'paid'
                            )
                            .reduce((s, m) => s + m.budget, 0),
                          contract.currency
                        )}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.print()}
                >
                  <Download className="w-4 h-4 mr-2" /> Export Contract
                </Button>

                {/* Complete contract (both parties can mark, typically creator) */}
                {isCreator && contract.status === 'active' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold"
                        disabled={completingContract}
                      >
                        {completingContract ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        )}
                        Mark as Completed
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Complete Contract?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will mark the contract as completed. Both parties
                          will be notified.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCompleteContract}>
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                {/* Archive (available after completed or rejected) */}
                {(contract.status === 'completed' ||
                  contract.status === 'rejected') && (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={archivingContract}
                    onClick={handleArchiveContract}
                  >
                    {archivingContract ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Archive className="w-4 h-4 mr-2" />
                    )}
                    Archive Contract
                  </Button>
                )}

                {/* Raise dispute */}
                {contract.status === 'active' && (
                  <Button
                    variant="outline"
                    className="w-full text-orange-600 hover:text-orange-700 border-orange-200 hover:bg-orange-50"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Raise Dispute
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
