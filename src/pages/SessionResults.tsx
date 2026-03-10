/**
 * SessionResults — Recruiter view of a completed assessment session.
 * Enhanced: shows coding submissions (per-question code + test case results)
 * alongside existing AI-chat transcript & score breakdown.
 */

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
  Code2,
  ChevronDown,
  ChevronRight,
  Target,
  MemoryStick,
  Timer,
  ShieldAlert,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as assessmentService from '@/services/assessmentService';
import type { AssessmentSession, Assessment, CodeSubmission, TestCaseResult } from '@/types/assessment';
import { ROUTES } from '@/config/constants';

export default function SessionResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);

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
  const isCoding = session.sessionType === 'coding';

  const scoreColor = (s: number) =>
    s >= 80 ? 'text-green-600' : s >= 60 ? 'text-amber-600' : 'text-red-600';

  const scoreBarColor = (s: number) =>
    s >= 80 ? 'bg-green-500' : s >= 60 ? 'bg-amber-500' : 'bg-red-500';

  const tcStatusColor = (passed: boolean) =>
    passed ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200';

  return (
    <DashboardLayout userRole="BusinessOwner">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-6">
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
            <div className="flex items-center gap-3">
              <h1 className="text-heading-sm sm:text-heading font-semibold text-gray-900 tracking-tight">
                Assessment Results
              </h1>
              <Badge className={`text-[10px] gap-1 ${isCoding ? 'bg-lime-100 text-lime-700' : 'bg-blue-100 text-blue-700'}`}>
                {isCoding ? <Code2 className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                {isCoding ? 'Coding' : 'AI Chat'}
              </Badge>
            </div>
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

      <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">
        {/* Score hero */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Overall Score</p>
          <p className={`text-3xl sm:text-5xl font-bold ${scoreColor(session.score ?? 0)}`}>
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
            {isCoding && session.submissions && (
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                {session.submissions.filter((s) => s.score === 100).length}/{session.submissions.length} solved
              </span>
            )}
          </div>
        </div>

        {/* ── Coding Submissions ──────────────────────────────── */}
        {isCoding && session.submissions && session.submissions.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-lime-600" />
              Code Submissions
            </h3>
            <div className="space-y-3">
              {session.submissions.map((sub, idx) => {
                const isExpanded = expandedSub === sub._id;
                const passRate = sub.totalCount > 0 ? Math.round((sub.passedCount / sub.totalCount) * 100) : 0;
                return (
                  <div key={sub._id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Submission header */}
                    <button
                      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedSub(isExpanded ? null : sub._id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                      <span className="text-xs text-gray-400 font-mono w-5 shrink-0">Q{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-gray-900 truncate">
                            {typeof sub.question === 'object' ? (sub.question as any).title : `Question ${idx + 1}`}
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {sub.language}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-gray-500">
                          {sub.passedCount}/{sub.totalCount} passed
                        </span>
                        <Badge className={`text-[10px] ${sub.score === 100 ? 'bg-green-100 text-green-700' : sub.score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {sub.score}%
                        </Badge>
                      </div>
                    </button>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 p-4 space-y-4 bg-gray-50/50">
                        {/* Code */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Submitted Code</h4>
                          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto font-mono whitespace-pre max-h-80">
                            {sub.code}
                          </pre>
                        </div>

                        {/* Execution info */}
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          {sub.executionTime != null && (
                            <span className="flex items-center gap-1">
                              <Timer className="w-3 h-3" />
                              {sub.executionTime}ms
                            </span>
                          )}
                          {sub.memoryUsed != null && (
                            <span className="flex items-center gap-1">
                              <MemoryStick className="w-3 h-3" />
                              {(sub.memoryUsed / 1024).toFixed(1)} KB
                            </span>
                          )}
                          <span>Status: {sub.statusDescription}</span>
                        </div>

                        {/* Test case results */}
                        {sub.testCaseResults && sub.testCaseResults.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Test Cases</h4>
                            <div className="space-y-1.5">
                              {sub.testCaseResults.map((tc, tIdx) => (
                                <div
                                  key={tIdx}
                                  className={`rounded-md border px-3 py-2 text-xs ${tcStatusColor(tc.passed)}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">
                                      {tc.passed ? '✓' : '✗'} Test {tIdx + 1}
                                      {tc.isHidden && <span className="ml-1 text-gray-400">(hidden)</span>}
                                    </span>
                                    {tc.executionTime != null && (
                                      <span className="text-gray-400">{tc.executionTime}ms</span>
                                    )}
                                  </div>
                                  {!tc.isHidden && (
                                    <div className="mt-1 grid grid-cols-3 gap-2 text-[11px]">
                                      <div>
                                        <p className="text-gray-400">Input</p>
                                        <code className="block bg-white/50 rounded px-1 py-0.5 truncate">{tc.input || '—'}</code>
                                      </div>
                                      <div>
                                        <p className="text-gray-400">Expected</p>
                                        <code className="block bg-white/50 rounded px-1 py-0.5 truncate">{tc.expectedOutput || '—'}</code>
                                      </div>
                                      <div>
                                        <p className="text-gray-400">Actual</p>
                                        <code className="block bg-white/50 rounded px-1 py-0.5 truncate">{tc.actualOutput || '—'}</code>
                                      </div>
                                    </div>
                                  )}
                                  {tc.error && (
                                    <p className="text-red-500 mt-1 truncate">{tc.error}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* AI Review */}
                        {sub.aiReview && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">AI Review</h4>
                            <p className="text-sm text-gray-600 whitespace-pre-line bg-white rounded-lg border p-3">
                              {sub.aiReview}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {session.strengths && session.strengths.length > 0 && (
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
          {session.weaknesses && session.weaknesses.length > 0 && (
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

        {/* Anti-cheat events (if any) */}
        {session.antiCheatEvents && session.antiCheatEvents.length > 0 && (
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
            <h3 className="font-semibold text-amber-800 flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4" />
              Anti-Cheat Events ({session.antiCheatEvents.length})
            </h3>
            <div className="space-y-2">
              {session.antiCheatEvents.map((evt, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-amber-700">{evt.event}</span>
                  <span className="text-xs text-amber-500">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conversation transcript (AI Chat sessions) */}
        {!isCoding && session.messages && session.messages.length > 0 && (
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
