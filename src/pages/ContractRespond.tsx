import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  Clock,
  Calendar,
  User,
  Building2,
  AlertTriangle,
  ShieldCheck,
  ArrowLeft,
  Flag,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/config/constants";
import type { Contract } from "@/types/contract";

/* ── Helpers ────────────────────────────────── */
const fmtCurrency = (v: number, cur: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(v);

const fmtDate = (d?: string) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/* ── Component ──────────────────────────────── */
export default function ContractRespond() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState<"accepted" | "rejected" | null>(null);

  /* fetch contract */
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiClient
      .get(`/api/contracts/${id}`)
      .then((res) => {
        setContract(res.data.contract);
      })
      .catch((err) => {
        const msg =
          err.response?.status === 403
            ? "You are not authorized to view this contract."
            : err.response?.status === 404
            ? "Contract not found."
            : "Could not load contract. Please try again.";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* computed values */
  const amount = useMemo(() => {
    if (!contract) return "";
    if (contract.contractType === "fixed") {
      return fmtCurrency(contract.budget || 0, contract.currency);
    }
    return `${fmtCurrency(contract.hourlyRate || 0, contract.currency)}/hr`;
  }, [contract]);

  const fee = useMemo(() => {
    if (!contract) return "";
    const base =
      contract.contractType === "fixed"
        ? contract.budget || 0
        : (contract.hourlyRate || 0) * (contract.hoursPerWeek || 0);
    return fmtCurrency(base * (contract.platformFee / 100), contract.currency);
  }, [contract]);

  const payout = useMemo(() => {
    if (!contract) return "";
    const base =
      contract.contractType === "fixed"
        ? contract.budget || 0
        : (contract.hourlyRate || 0) * (contract.hoursPerWeek || 0);
    const net = base - base * (contract.platformFee / 100);
    return fmtCurrency(net, contract.currency);
  }, [contract]);

  const senderName = useMemo(() => {
    if (!contract?.creator) return "Unknown";
    const c = contract.creator;
    return c.companyName
      ? `${c.firstName} ${c.lastName} (${c.companyName})`
      : `${c.firstName} ${c.lastName}`;
  }, [contract]);

  /* redirect target based on role */
  const dashboardRoute = useMemo(() => {
    if (!user) return ROUTES.HOME;
    return user.role === "BusinessOwner"
      ? ROUTES.EMPLOYER_DASHBOARD
      : ROUTES.FREELANCER_DASHBOARD;
  }, [user]);

  /* ── Actions ──────────────────────────────── */
  const handleAccept = async () => {
    setAccepting(true);
    setActionError("");
    try {
      await apiClient.patch(`/api/contracts/${id}/status`, {
        status: "active",
      });
      setActionSuccess("accepted");
    } catch {
      setActionError("Failed to accept contract. Please try again.");
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = async () => {
    if (!declineReason.trim()) {
      setActionError("Please provide a reason for declining.");
      return;
    }
    setDeclining(true);
    setActionError("");
    try {
      await apiClient.patch(`/api/contracts/${id}/status`, {
        status: "rejected",
        rejectionReason: declineReason.trim(),
      });
      setActionSuccess("rejected");
    } catch {
      setActionError("Failed to decline contract. Please try again.");
    } finally {
      setDeclining(false);
    }
  };

  /* ── Render states ────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-lime-500 mx-auto" />
          <p className="mt-3 text-gray-500">Loading contract…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-heading-sm font-semibold text-gray-900 mb-2">
            Unable to Load Contract
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button variant="outline" onClick={() => navigate(dashboardRoute)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!contract) return null;

  /* If contract is already responded to */
  const alreadyResponded =
    contract.status !== "pending" && contract.status !== "draft";

  /* ── Success state after action ───────────── */
  if (actionSuccess) {
    const accepted = actionSuccess === "accepted";
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div
            className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              accepted ? "bg-lime-100" : "bg-red-100"
            }`}
          >
            {accepted ? (
              <CheckCircle2 className="w-9 h-9 text-lime-600" />
            ) : (
              <XCircle className="w-9 h-9 text-red-500" />
            )}
          </div>
          <h2 className="text-heading font-semibold text-gray-900 mb-2">
            Contract {accepted ? "Accepted" : "Declined"}
          </h2>
          <p className="text-gray-500 mb-2">
            {accepted
              ? `You've accepted "${contract.contractName}". The sender has been notified and the contract is now active.`
              : `You've declined "${contract.contractName}". The sender has been notified.`}
          </p>
          <p className="text-sm text-gray-400 mb-6">
            {accepted
              ? "You can track milestones and progress from your dashboard."
              : "You can still view this contract in your dashboard history."}
          </p>
          <Button
            onClick={() => navigate(dashboardRoute)}
            className="bg-lime-500 hover:bg-lime-600 text-black font-bold px-8"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  /* ── Main layout ──────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(dashboardRoute)}
            className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
          </button>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
            {alreadyResponded ? contract.status.toUpperCase() : "PENDING RESPONSE"}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* ── Header card ──────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-lime-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-lime-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-heading-sm sm:text-heading font-semibold text-gray-900 mb-1">
                {contract.contractName}
              </h1>
              <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> From: {senderName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Sent{" "}
                  {fmtDate(contract.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* contract type + category badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-lime-50 text-lime-700 border border-lime-200">
              {contract.contractType === "fixed" ? (
                <DollarSign className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              {contract.contractType === "fixed" ? "Fixed Price" : "Hourly"}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 border border-gray-200">
              <Layers className="w-3 h-3" />
              {contract.category}
              {contract.subcategory ? ` / ${contract.subcategory}` : ""}
            </span>
            {contract.dueDate && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                <Flag className="w-3 h-3" />
                Due {fmtDate(contract.dueDate)}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Description
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {contract.description}
            </p>
          </div>
        </div>

        {/* ── Payment details card ─────────────── */}
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <h2 className="text-subheading text-gray-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-lime-600" /> Payment Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">
                {contract.contractType === "fixed"
                  ? "Total Budget"
                  : "Hourly Rate"}
              </p>
              <p className="text-heading-sm font-bold text-gray-900">{amount}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">
                Platform Fee ({contract.platformFee}%)
              </p>
              <p className="text-heading-sm font-bold text-gray-900">{fee}</p>
            </div>
            <div className="bg-lime-50 rounded-lg p-4 border border-lime-200">
              <p className="text-xs text-lime-700 mb-1">Your Payout</p>
              <p className="text-heading-sm font-bold text-lime-700">{payout}</p>
            </div>
          </div>

          {contract.contractType === "hourly" && (
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              {contract.hoursPerWeek && (
                <div>
                  <span className="font-medium">Hours / Week:</span>{" "}
                  {contract.hoursPerWeek}
                </div>
              )}
              {contract.weeklyLimit && (
                <div>
                  <span className="font-medium">Weekly Limit:</span>{" "}
                  {fmtCurrency(contract.weeklyLimit, contract.currency)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Milestones card ──────────────────── */}
        {contract.splitMilestones &&
          contract.milestones &&
          contract.milestones.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
              <h2 className="text-subheading text-gray-900 mb-4">
                Milestones ({contract.milestones.length})
              </h2>
              <div className="space-y-3">
                {contract.milestones
                  .sort((a, b) => a.order - b.order)
                  .map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-lime-100 text-lime-700 text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {m.name}
                          </p>
                          {m.dueDate && (
                            <p className="text-xs text-gray-400">
                              Due {fmtDate(m.dueDate)}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        {fmtCurrency(m.budget, contract.currency)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* ── Already-responded notice ─────────── */}
        {alreadyResponded && (
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  contract.status === "active"
                    ? "bg-lime-100"
                    : contract.status === "rejected"
                    ? "bg-red-100"
                    : "bg-gray-100"
                }`}
              >
                {contract.status === "active" ? (
                  <CheckCircle2 className="w-5 h-5 text-lime-600" />
                ) : contract.status === "rejected" ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <FileText className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  This contract is{" "}
                  <span className="capitalize">{contract.status}</span>
                </p>
                {contract.rejectionReason && (
                  <p className="text-sm text-gray-500 mt-1">
                    Decline reason: {contract.rejectionReason}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => navigate(dashboardRoute)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
            </div>
          </div>
        )}

        {/* ── Action area (only for pending) ───── */}
        {!alreadyResponded && (
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <h2 className="text-subheading text-gray-900 mb-1">
              Your Response
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Review the details above carefully before responding.
            </p>

            {actionError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {actionError}
              </div>
            )}

            {/* Decline form (toggled) */}
            {showDeclineForm && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <label className="block text-sm font-semibold text-red-700 mb-2">
                  Why are you declining? <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border border-red-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none resize-none"
                  rows={3}
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="Provide a brief reason…"
                  maxLength={500}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-400">
                    {declineReason.length}/500
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowDeclineForm(false);
                        setDeclineReason("");
                        setActionError("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={declining || !declineReason.trim()}
                      onClick={handleDecline}
                    >
                      {declining && (
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      )}
                      Confirm Decline
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            {!showDeclineForm && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  disabled={accepting || declining}
                  onClick={handleAccept}
                  className="flex-1 bg-lime-500 hover:bg-lime-600 text-black font-bold h-12 text-base"
                >
                  {accepting ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                  )}
                  Accept Contract
                </Button>
                <Button
                  variant="outline"
                  disabled={accepting || declining}
                  onClick={() => setShowDeclineForm(true)}
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 h-12 text-base"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Decline
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
