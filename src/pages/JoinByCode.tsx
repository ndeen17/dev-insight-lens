/**
 * JoinByCode — Public landing page for shareable invite code links.
 * Route: /assessment/join/:code
 * Resolves the invite code, shows assessment info, and lets the candidate start.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Code2,
  Bot,
  Clock,
  HelpCircle,
  BarChart3,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Shield,
  LogIn,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as assessmentService from '@/services/assessmentService';
import type { Assessment, AssessmentInvitation } from '@/types/assessment';
import { ROUTES } from '@/config/constants';

const diffBadge: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
};

export default function JoinByCode() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();
  const { toast } = useToast();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!code) return;
    (async () => {
      try {
        const data = await assessmentService.getAssessmentByInviteCode(code);
        setAssessment(data);
      } catch {
        setError('This invite link is invalid or the assessment is no longer active.');
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  const handleJoin = async () => {
    if (!code) return;
    setJoining(true);
    try {
      const { invitation } = await assessmentService.joinByInviteCode(code);
      // Start session immediately
      const { session } = await assessmentService.startSession(invitation._id);
      navigate(`/assessment/session/${session._id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to join assessment';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setJoining(false);
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Invalid Invite Link</h2>
          <p className="text-gray-500 mb-6">{error || 'Assessment not found.'}</p>
          <Button variant="outline" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const isCoding = assessment.assessmentType === 'coding';
  const employer = assessment.createdBy as any;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg max-w-lg w-full overflow-hidden">
        {/* Color banner */}
        <div className={`h-2 ${isCoding ? 'bg-lime-500' : 'bg-blue-600'}`} />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Assessment info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`text-[10px] gap-1 ${isCoding ? 'bg-lime-100 text-lime-700' : 'bg-blue-100 text-blue-700'}`}>
                {isCoding ? <Code2 className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                {isCoding ? 'Coding Assessment' : 'AI Chat Assessment'}
              </Badge>
              <Badge className={diffBadge[assessment.difficulty] || ''}>
                {assessment.difficulty}
              </Badge>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{assessment.title}</h1>

            {assessment.description && (
              <p className="text-gray-500 text-sm">{assessment.description}</p>
            )}

            {employer && typeof employer === 'object' && (
              <p className="text-xs text-gray-400 mt-2">
                By {employer.companyName || `${employer.firstName} ${employer.lastName}`}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <HelpCircle className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{assessment.questionCount}</p>
              <p className="text-[10px] text-gray-500 uppercase">Questions</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{assessment.timeLimitMinutes}</p>
              <p className="text-[10px] text-gray-500 uppercase">Minutes</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <BarChart3 className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-gray-900 truncate">{assessment.profession}</p>
              <p className="text-[10px] text-gray-500 uppercase">Field</p>
            </div>
          </div>

          {/* Skills */}
          {assessment.skills && assessment.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {assessment.skills.map((s) => (
                <Badge key={s} variant="outline" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          )}

          {/* Coding-specific info */}
          {isCoding && assessment.allowedLanguages && assessment.allowedLanguages.length > 0 && (
            <div className="bg-lime-50 border border-lime-200 rounded-lg p-3">
              <p className="text-xs font-medium text-lime-800 mb-1">Allowed Languages</p>
              <div className="flex flex-wrap gap-1.5">
                {assessment.allowedLanguages.map((l) => (
                  <Badge key={l} variant="outline" className="text-[10px] bg-white">
                    {l}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1">
            <p className="text-xs font-medium text-amber-800 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Before you begin:
            </p>
            <ul className="text-[11px] text-amber-700 space-y-0.5 list-disc pl-4">
              <li>You will have {assessment.timeLimitMinutes} minutes to complete the assessment</li>
              <li>Tab switching and copy/paste may be monitored</li>
              <li>Your progress is saved automatically</li>
              {isCoding && <li>You can run code against sample test cases before submitting</li>}
            </ul>
          </div>

          {/* Action */}
          {isSignedIn ? (
            <Button
              onClick={handleJoin}
              disabled={joining}
              className={`w-full font-bold text-base py-6 ${
                isCoding
                  ? 'bg-lime-500 hover:bg-lime-600 text-black'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {joining ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Starting…
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Start Assessment
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 text-center">
                You need to sign in to take this assessment
              </p>
              <Button
                onClick={() => navigate(`${ROUTES.SIGN_IN}?redirect=/assessment/join/${code}`)}
                className="w-full font-bold bg-black hover:bg-gray-800 text-white py-6"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In to Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
