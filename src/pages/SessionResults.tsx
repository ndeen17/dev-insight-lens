import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Loader2,
  XCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Bot,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as assessmentService from '@/services/assessmentService';
import type { AssessmentSession, Assessment } from '@/types/assessment';
import { ROUTES } from '@/config/constants';

export default function SessionResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const s = await assessmentService.getSession(id);
        setSession(s);
      } catch {
        toast({ title: 'Error', description: 'Failed to load results', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, toast]);

  if (loading) {
    return (
      <DashboardLayout userRole="BusinessOwner">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return (
      <DashboardLayout userRole="BusinessOwner">
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <XCircle className="w-10 h-10 text-red-400" />
          <p className="text-gray-600">Session not found</p>
          <Button variant="outline" onClick={() => navigate(ROUTES.EMPLOYER_ASSESSMENTS)}>
            Back to Assessments
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const assessment = (typeof session.assessment === 'object' ? session.assessment : null) as Assessment | null;
  const freelancer = typeof session.freelancer === 'object' ? session.freelancer as any : null;

  const scoreColor = (s: number) =>
    s >= 80 ? 'text-green-600' : s >= 60 ? 'text-amber-600' : 'text-red-600';

  const scoreBarColor = (s: number) =>
    s >= 80 ? 'bg-green-500' : s >= 60 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <DashboardLayout userRole="BusinessOwner">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (assessment) navigate(`/employer/assessments/${assessment._id}`);
              else navigate(ROUTES.EMPLOYER_ASSESSMENTS);
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assessment Results</h1>
            <div className="flex items-center gap-3 mt-1">
              {assessment && (
                <span className="text-sm text-gray-500">{assessment.title}</span>
              )}
              {freelancer && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="text-sm text-gray-500">
                    {freelancer.firstName} {freelancer.lastName}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-8 space-y-8">
        {/* Score hero */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Overall Score</p>
          <p className={`text-5xl font-bold ${scoreColor(session.score ?? 0)}`}>
            {session.score ?? '—'}%
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {session.timeSpentSeconds
                ? `${Math.floor(session.timeSpentSeconds / 60)}m ${session.timeSpentSeconds % 60}s`
                : '—'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {session.totalQuestions} questions
            </span>
          </div>
        </div>

        {/* Breakdown */}
        {session.breakdown && Object.keys(session.breakdown).length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Skill Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(session.breakdown).map(([skill, score]) => (
                <div key={skill}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{skill}</span>
                    <span className={`text-sm font-semibold ${scoreColor(score)}`}>{score}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${scoreBarColor(score)}`}
                      style={{ width: `${Math.min(score, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Summary */}
        {session.aiSummary && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">AI Summary</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {session.aiSummary}
            </p>
          </div>
        )}

        {/* Strengths + Weaknesses */}
        <div className="grid grid-cols-2 gap-4">
          {session.strengths.length > 0 && (
            <div className="bg-green-50 rounded-xl border border-green-200 p-5">
              <h3 className="font-semibold text-green-800 flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {session.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {session.weaknesses.length > 0 && (
            <div className="bg-red-50 rounded-xl border border-red-200 p-5">
              <h3 className="font-semibold text-red-800 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" />
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {session.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Conversation transcript */}
        {session.messages && session.messages.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Conversation Transcript</h3>
            <ScrollArea className="max-h-[500px]">
              <div className="space-y-4">
                {session.messages.map((m) => (
                  <div
                    key={m._id}
                    className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        m.role === 'ai' ? 'bg-gray-100' : 'bg-black'
                      }`}
                    >
                      {m.role === 'ai' ? (
                        <Bot className="w-3.5 h-3.5 text-gray-500" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg px-3 py-2 max-w-[80%] text-sm whitespace-pre-wrap ${
                        m.role === 'ai'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-black text-white'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
