import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Clock,
  HelpCircle,
  BarChart3,
  User,
  AlertTriangle,
  ArrowRight,
  XCircle,
} from 'lucide-react';
import * as assessmentService from '@/services/assessmentService';
import type { AssessmentInvitation, Assessment } from '@/types/assessment';
import { ROUTES } from '@/config/constants';

/**
 * AssessmentInvite — landing page when a freelancer clicks an invite link.
 * Route: /assessment/invite/:token
 *
 * Flow:
 *  1. Resolve token → show assessment info + employer info
 *  2. Freelancer clicks "Start Assessment"
 *  3. Creates a session and navigates to /assessment/session/:sessionId
 *
 * If not logged in, ProtectedRoute will redirect to signup first,
 * then the user comes back here.
 */
const AssessmentInvite = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [invitation, setInvitation] = useState<AssessmentInvitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const inv = await assessmentService.getInvitationByToken(token);
        setInvitation(inv);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404) setError('This invitation link is invalid or does not exist.');
        else if (status === 410) setError('This invitation has expired.');
        else setError('Failed to load invitation.');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleStart = async () => {
    if (!invitation) return;
    setStarting(true);

    try {
      const { session } = await assessmentService.startSession(invitation._id);
      navigate(`/assessment/session/${session._id}`, { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to start assessment.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setStarting(false);
    }
  };

  const handleDecline = async () => {
    if (!invitation) return;
    try {
      await assessmentService.declineInvitation(invitation._id);
      toast({ title: 'Invitation declined' });
      navigate(ROUTES.FREELANCER_DASHBOARD, { replace: true });
    } catch {
      toast({ title: 'Error', description: 'Failed to decline.', variant: 'destructive' });
    }
  };

  // ── Loading ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
        <XCircle className="w-12 h-12 text-red-400" />
        <p className="text-gray-700 text-lg font-medium">{error}</p>
        <Button variant="outline" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </div>
    );
  }

  if (!invitation) return null;

  const assessment = (typeof invitation.assessment === 'object' ? invitation.assessment : null) as Assessment | null;
  const employer = typeof invitation.employer === 'object' ? invitation.employer : null;
  const alreadyCompleted = invitation.status === 'completed';
  const alreadyDeclined = invitation.status === 'declined';

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Skill Assessment</h1>
          <p className="text-gray-500 text-sm">
            {employer
              ? `${employer.firstName || ''} ${employer.lastName || ''}${employer.companyName ? ` (${employer.companyName})` : ''}`
              : 'An employer'}{' '}
            invited you to take an assessment.
          </p>
        </div>

        {/* Assessment details card */}
        {assessment && (
          <div className="border rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">{assessment.title}</h2>
            {assessment.description && (
              <p className="text-sm text-gray-500">{assessment.description}</p>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4 text-gray-400" />
                {assessment.profession}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                <span className="capitalize">{assessment.difficulty}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <HelpCircle className="w-4 h-4 text-gray-400" />
                {assessment.questionCount} questions
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                {assessment.timeLimitMinutes} min
              </div>
            </div>

            {assessment.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {assessment.skills.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs py-0.5">
                    {s}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Personal message */}
        {invitation.message && (
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 italic">
            "{invitation.message}"
          </div>
        )}

        {/* Warnings */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 flex gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Before you start</p>
            <ul className="list-disc list-inside space-y-1 text-amber-700">
              <li>The timer starts immediately when you begin</li>
              <li>You cannot paste text — all answers must be typed</li>
              <li>Answer each question thoughtfully, the AI adapts to your level</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        {alreadyCompleted ? (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-3">You've already completed this assessment!</p>
            <Button variant="outline" onClick={() => navigate(ROUTES.FREELANCER_DASHBOARD)}>
              Back to Dashboard
            </Button>
          </div>
        ) : alreadyDeclined ? (
          <div className="text-center">
            <p className="text-gray-500 font-medium">You declined this invitation.</p>
          </div>
        ) : (
          <div className="flex gap-3">
            {user && (
              <Button variant="outline" onClick={handleDecline} className="flex-1">
                Decline
              </Button>
            )}
            <Button
              onClick={handleStart}
              disabled={starting}
              className="flex-1 bg-black hover:bg-gray-800 text-white"
            >
              {starting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Starting…
                </>
              ) : (
                <>
                  Start Assessment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentInvite;
