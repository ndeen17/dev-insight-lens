/**
 * AssessmentShell — Unified assessment experience.
 * Route: /assessment/session/:id
 *
 * Detects session type and renders:
 *  - AI Chat mode: original chat interface (questions via AI)
 *  - Coding mode: split pane with question sidebar, Monaco editor, execution panel
 */

import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AssessmentChat from '@/components/assessment/AssessmentChat';
import AssessmentTimer from '@/components/assessment/AssessmentTimer';
import SecureInput from '@/components/assessment/SecureInput';
import CodeEditor from '@/components/assessment/CodeEditor';
import CodeExecutionPanel from '@/components/assessment/CodeExecutionPanel';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Code2,
  Bot,
  ChevronLeft,
  ChevronRight,
  Flag,
  Target,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import * as assessmentService from '@/services/assessmentService';
import * as codeExecutionService from '@/services/codeExecutionService';
import { useAntiCheat } from '@/hooks/useAntiCheat';
import type { AssessmentSession, Assessment, Question, TestCaseResult, ExecutionResult, LanguageInfo } from '@/types/assessment';
import { ROUTES } from '@/config/constants';

const qDiffColor: Record<string, string> = {
  easy: 'text-green-600',
  medium: 'text-amber-600',
  hard: 'text-red-600',
};

// ═══════════════════════════════════════════════════════════════
//  Main Shell — loads session, delegates to sub-shell
// ═══════════════════════════════════════════════════════════════

const AssessmentShell = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const s = await assessmentService.getSession(id);
        setSession(s);
        if (typeof s.assessment === 'object') {
          setAssessment(s.assessment as Assessment);
        }
      } catch {
        toast({ title: 'Error', description: 'Failed to load assessment session.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, toast]);

  // ── Loading ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
        <XCircle className="w-12 h-12 text-red-400" />
        <p className="text-gray-600">Session not found</p>
        <Button variant="outline" onClick={() => navigate(ROUTES.ASSESSMENT_INVITATIONS)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  const isComplete = session.status === 'completed' || session.status === 'timed_out';

  // ── Completed state (shared between both modes) ────────────
  if (isComplete) {
    return <CompletedView session={session} navigate={navigate} />;
  }

  // ── Delegate ───────────────────────────────────────────────
  const isCoding = session.sessionType === 'coding';

  if (isCoding) {
    return (
      <CodingShell
        session={session}
        assessment={assessment}
        onSessionUpdate={setSession}
      />
    );
  }

  return (
    <AIChatShell
      session={session}
      assessment={assessment}
      onSessionUpdate={setSession}
    />
  );
};

export default AssessmentShell;

// ═══════════════════════════════════════════════════════════════
//  COMPLETED VIEW
// ═══════════════════════════════════════════════════════════════

function CompletedView({
  session,
  navigate,
}: {
  session: AssessmentSession;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const assessment = typeof session.assessment === 'object' ? (session.assessment as Assessment) : null;
  const isCoding = session.sessionType === 'coding';
  const timeMin = session.timeSpentSeconds ? Math.floor(session.timeSpentSeconds / 60) : 0;
  const timeSec = session.timeSpentSeconds ? session.timeSpentSeconds % 60 : 0;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-6">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900">Assessment Complete</h1>

        {/* Assessment context */}
        {assessment && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-semibold text-gray-800">{assessment.title}</p>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <Badge variant="outline" className={isCoding ? 'bg-lime-100 text-lime-700 border-lime-200' : 'bg-blue-100 text-blue-700 border-blue-200'}>
                {isCoding ? <Code2 className="w-3 h-3 mr-1" /> : <Bot className="w-3 h-3 mr-1" />}
                {isCoding ? 'Coding' : 'AI Chat'}
              </Badge>
              <Badge variant="outline">{assessment.profession}</Badge>
              <Badge variant="outline" className={
                assessment.difficulty === 'advanced' ? 'bg-red-100 text-red-700' :
                assessment.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }>
                {assessment.difficulty}
              </Badge>
            </div>
            {session.timeSpentSeconds > 0 && (
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Completed in {timeMin}m {timeSec}s
                {session.completedAt && (
                  <span className="text-gray-400 ml-2">
                    — {new Date(session.completedAt).toLocaleDateString()}
                  </span>
                )}
              </p>
            )}
          </div>
        )}

        {session.score != null && (
          <div className="bg-gray-50 rounded-xl p-6 border">
            <p className="text-5xl font-bold text-gray-900">{session.score}</p>
            <p className="text-sm text-gray-500 mt-1">out of 100</p>
          </div>
        )}

        {session.aiSummary && (
          <p className="text-gray-600 text-sm leading-relaxed">{session.aiSummary}</p>
        )}

        {session.strengths && session.strengths.length > 0 && (
          <div className="text-left">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Strengths</p>
            <ul className="space-y-1">
              {session.strengths.map((s, i) => (
                <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">+</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {session.weaknesses && session.weaknesses.length > 0 && (
          <div className="text-left">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Areas to improve</p>
            <ul className="space-y-1">
              {session.weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">-</span> {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {session.breakdown && Object.keys(session.breakdown).length > 0 && (
          <div className="text-left space-y-2">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Score Breakdown</p>
            {Object.entries(session.breakdown).map(([category, score]) => (
              <div key={category} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-36 truncate">{category}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-black rounded-full h-2 transition-all"
                    style={{ width: `${Math.min(score, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-10 text-right">{score}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 justify-center pt-4">
          <Button variant="outline" onClick={() => navigate(ROUTES.ASSESSMENT_INVITATIONS)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> My Assessments
          </Button>
          <Button onClick={() => navigate(ROUTES.FREELANCER_PROFILE)} className="bg-gray-900 hover:bg-gray-800 text-white">
            View My Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  AI CHAT SHELL  (original behavior)
// ═══════════════════════════════════════════════════════════════

function AIChatShell({
  session: initialSession,
  assessment,
  onSessionUpdate,
}: {
  session: AssessmentSession;
  assessment: Assessment | null;
  onSessionUpdate: (s: AssessmentSession) => void;
}) {
  const { toast } = useToast();
  const [session, setSession] = useState(initialSession);
  const [sending, setSending] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Anti-cheat monitoring
  useAntiCheat(session._id, true);

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || sending) return;
    setSending(true);
    const text = inputValue.trim();
    setInputValue('');
    try {
      const res = await assessmentService.sendMessage(session._id, text);
      setSession(res.session);
      onSessionUpdate(res.session);
    } catch {
      toast({ title: 'Error', description: 'Failed to send message.', variant: 'destructive' });
      setInputValue(text);
    } finally {
      setSending(false);
    }
  }, [session, inputValue, sending, toast, onSessionUpdate]);

  const handleTimeUp = useCallback(() => {
    toast({ title: 'Time is up!', description: 'Your assessment has ended.', variant: 'destructive' });
    assessmentService.getSession(session._id).then((s) => {
      setSession(s);
      onSessionUpdate(s);
    }).catch(() => {});
  }, [session._id, toast, onSessionUpdate]);

  const progress = session.totalQuestions > 0
    ? Math.round((session.currentQuestionIndex / session.totalQuestions) * 100)
    : 0;

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex-shrink-0 border-b px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-500" />
              <h1 className="text-sm font-semibold text-gray-900 truncate">
                {assessment?.title || 'Skill Assessment'}
              </h1>
            </div>
            <p className="text-xs text-gray-500">
              Question {session.currentQuestionIndex} of {session.totalQuestions}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 w-32">
              <Progress value={progress} className="h-2" />
              <span className="text-xs text-gray-400 w-8">{progress}%</span>
            </div>
            {assessment && (
              <AssessmentTimer
                timeLimitMinutes={assessment.timeLimitMinutes}
                startedAt={session.startedAt}
                onTimeUp={handleTimeUp}
              />
            )}
          </div>
        </div>
      </header>

      <AssessmentChat messages={session.messages} isLoading={sending} />

      <footer className="flex-shrink-0 border-t p-4">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <div className="flex-1">
            <SecureInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSend}
              disabled={sending}
              placeholder="Type your answer… (Enter to send, Shift+Enter for newline)"
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={sending || !inputValue.trim()}
            className="bg-black hover:bg-gray-800 text-white h-10 px-5"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
          </Button>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CODING SHELL  (HackerRank-style)
// ═══════════════════════════════════════════════════════════════

function CodingShell({
  session: initialSession,
  assessment,
  onSessionUpdate,
}: {
  session: AssessmentSession;
  assessment: Assessment | null;
  onSessionUpdate: (s: AssessmentSession) => void;
}) {
  const { toast } = useToast();
  const [session, setSession] = useState(initialSession);

  // Anti-cheat monitoring
  useAntiCheat(session._id, true);

  // Questions from assessment
  const questions: Question[] = assessment?.questions
    ? (assessment.questions.filter((q): q is Question => typeof q === 'object' && q !== null))
    : [];

  // Current question index
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentQ = questions[currentIdx] || null;

  // Languages (loaded from API, filtered to assessment allowList)
  const [allLanguages, setAllLanguages] = useState<LanguageInfo[]>([]);
  const [filteredLanguages, setFilteredLanguages] = useState<LanguageInfo[]>([]);

  // Per-question state keyed by question ID
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [langMap, setLangMap] = useState<Record<string, LanguageInfo>>({});

  // Execution state
  const [running, setRunning] = useState(false);
  const [runningSamples, setRunningSamples] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [testCaseResults, setTestCaseResults] = useState<TestCaseResult[]>([]);
  const [stdin, setStdin] = useState('');

  // Question nav panel
  const [showNav, setShowNav] = useState(true);

  // Finish dialog
  const [finishOpen, setFinishOpen] = useState(false);
  const [finishing, setFinishing] = useState(false);

  // Submission score for current question
  const currentSubmission = currentQ
    ? session.submissions?.find((s) => {
        const sQId = typeof s.question === 'object' ? (s.question as any)._id : s.question;
        return sQId === currentQ._id;
      })
    : undefined;

  // ── Load languages on mount ────────────────────────────────
  useEffect(() => {
    codeExecutionService.getLanguages().then((langs) => {
      setAllLanguages(langs);
      const allowed = assessment?.allowedLanguages || [];
      const filtered = allowed.length > 0
        ? langs.filter((l) => allowed.includes(l.key))
        : langs;
      setFilteredLanguages(filtered.length > 0 ? filtered : langs);
    }).catch(() => {});
  }, [assessment?.allowedLanguages]);

  // ── Helpers ────────────────────────────────────────────────
  const getCurrentLang = (): LanguageInfo => {
    const qId = currentQ?._id || '';
    if (langMap[qId]) return langMap[qId];
    return filteredLanguages[0] || { key: 'javascript', id: 63, name: 'JavaScript', monacoId: 'javascript' };
  };

  const getCurrentCode = (): string => {
    const qId = currentQ?._id || '';
    if (codeMap[qId] != null) return codeMap[qId];
    // Try to find starter code for the current language
    const lang = getCurrentLang();
    const starter = currentQ?.starterCode?.find((sc) => sc.language === lang.key);
    return starter?.code || '';
  };

  const setCurrentCode = (code: string) => {
    if (!currentQ) return;
    setCodeMap((prev) => ({ ...prev, [currentQ._id]: code }));
  };

  const setCurrentLang = (lang: LanguageInfo) => {
    if (!currentQ) return;
    setLangMap((prev) => ({ ...prev, [currentQ._id]: lang }));
    // If user hasn't typed any code yet, load starter code for new lang
    if (!codeMap[currentQ._id]) {
      const starter = currentQ.starterCode?.find((sc) => sc.language === lang.key);
      if (starter) {
        setCodeMap((prev) => ({ ...prev, [currentQ._id]: starter.code }));
      }
    }
  };

  // Track submission status per question
  const submissionStatus = (qId: string): 'none' | 'partial' | 'solved' => {
    const sub = session.submissions?.find((s) => {
      const subQId = typeof s.question === 'object' ? (s.question as any)._id : s.question;
      return subQId === qId;
    });
    if (!sub) return 'none';
    if (sub.score === 100) return 'solved';
    return 'partial';
  };

  // ── Run Code (sandbox, custom stdin) ───────────────────────
  const handleRun = async () => {
    if (!currentQ || running) return;
    setRunning(true);
    setExecutionResult(null);
    setTestCaseResults([]);
    try {
      const res = await codeExecutionService.runCode({
        sourceCode: getCurrentCode(),
        language: getCurrentLang().key,
        stdin,
      });
      setExecutionResult(res);
    } catch {
      toast({ title: 'Run failed', description: 'Could not execute code', variant: 'destructive' });
    } finally {
      setRunning(false);
    }
  };

  // ── Run Against Sample Test Cases ──────────────────────────
  const handleRunSamples = async () => {
    if (!currentQ || runningSamples) return;
    setRunningSamples(true);
    setExecutionResult(null);
    setTestCaseResults([]);
    try {
      const res = await codeExecutionService.runAgainstSamples({
        sourceCode: getCurrentCode(),
        language: getCurrentLang().key,
        questionId: currentQ._id,
      });
      setTestCaseResults(res.results);
    } catch {
      toast({ title: 'Run failed', description: 'Could not run against samples', variant: 'destructive' });
    } finally {
      setRunningSamples(false);
    }
  };

  // ── Submit Code for Grading (all test cases) ──────────────
  const handleSubmit = async () => {
    if (!currentQ || submitting) return;
    setSubmitting(true);
    try {
      const res = await codeExecutionService.submitCode({
        sessionId: session._id,
        questionId: currentQ._id,
        sourceCode: getCurrentCode(),
        language: getCurrentLang().key,
      });
      setTestCaseResults(res.results);

      // Refresh session to get updated submissions array
      const updated = await assessmentService.getSession(session._id);
      setSession(updated);
      onSessionUpdate(updated);

      toast({
        title: res.submission.score === 100 ? 'All tests passed!' : `Score: ${res.submission.score}%`,
        description: `${res.submission.passedCount}/${res.submission.totalCount} test cases passed`,
      });
    } catch {
      toast({ title: 'Submit failed', description: 'Could not submit code', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Finish assessment ──────────────────────────────────────
  const handleFinish = async () => {
    setFinishing(true);
    try {
      const updated = await assessmentService.finishCodingSession(session._id);
      setSession(updated);
      onSessionUpdate(updated);
    } catch {
      toast({ title: 'Error', description: 'Failed to finish assessment', variant: 'destructive' });
    } finally {
      setFinishing(false);
      setFinishOpen(false);
    }
  };

  // ── Time-up handler ────────────────────────────────────────
  const handleTimeUp = useCallback(() => {
    toast({ title: 'Time is up!', description: 'Your assessment will be submitted.', variant: 'destructive' });
    assessmentService.finishCodingSession(session._id).then((s) => {
      setSession(s);
      onSessionUpdate(s);
    }).catch(() => {});
  }, [session._id, toast, onSessionUpdate]);

  // ── Clear results when switching question ──────────────────
  const switchQuestion = (idx: number) => {
    setCurrentIdx(idx);
    setTestCaseResults([]);
    setExecutionResult(null);
    setStdin('');
  };

  const submittedCount = session.submissions?.length || 0;
  const solvedCount = session.submissions?.filter((s) => s.score === 100).length || 0;
  const starterCode = currentQ?.starterCode?.find((sc) => sc.language === getCurrentLang().key)?.code || '';

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="flex-shrink-0 bg-gray-900 border-b border-gray-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Code2 className="w-4 h-4 text-lime-400 shrink-0" />
          <h1 className="text-sm font-semibold text-white truncate">
            {assessment?.title || 'Coding Assessment'}
          </h1>
          <Badge className="text-[10px] bg-lime-500/20 text-lime-400 border-none">
            {submittedCount}/{questions.length} submitted
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 hidden sm:inline">
            {solvedCount} solved
          </span>
          {assessment && (
            <AssessmentTimer
              timeLimitMinutes={assessment.timeLimitMinutes}
              startedAt={session.startedAt}
              onTimeUp={handleTimeUp}
            />
          )}
          <Button
            onClick={() => setFinishOpen(true)}
            variant="outline"
            size="sm"
            className="border-lime-500/50 text-lime-400 hover:bg-lime-500/10 text-xs"
          >
            <Flag className="w-3 h-3 mr-1" />
            Finish
          </Button>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question Navigator (left sidebar) */}
        {showNav && (
          <div className="w-56 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
            <div className="p-3 border-b border-gray-800">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Questions</p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {questions.map((q, idx) => {
                  const status = submissionStatus(q._id);
                  return (
                    <button
                      key={q._id}
                      onClick={() => switchQuestion(idx)}
                      className={`w-full text-left rounded-lg px-3 py-2 text-xs transition-colors ${
                        idx === currentIdx
                          ? 'bg-lime-500/15 text-lime-400 border border-lime-500/30'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-gray-600 w-4">{idx + 1}</span>
                        <span className="truncate flex-1">{q.title}</span>
                        {status === 'solved' && <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />}
                        {status === 'partial' && <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 ml-6">
                        <span className={`text-[10px] ${qDiffColor[q.difficulty] || 'text-gray-500'}`}>
                          {q.difficulty}
                        </span>
                        <span className="text-[10px] text-gray-600">{q.points}pts</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Toggle nav */}
        <button
          className="w-5 shrink-0 flex items-center justify-center bg-gray-900 border-r border-gray-800 hover:bg-gray-800 transition-colors"
          onClick={() => setShowNav(!showNav)}
        >
          {showNav ? <ChevronLeft className="w-3 h-3 text-gray-500" /> : <ChevronRight className="w-3 h-3 text-gray-500" />}
        </button>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentQ ? (
            <>
              {/* Question description bar */}
              <div className="shrink-0 bg-gray-900 border-b border-gray-800 px-4 py-3 max-h-[35vh] overflow-y-auto">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="font-semibold text-white text-sm">
                    Q{currentIdx + 1}. {currentQ.title}
                  </h2>
                  <Badge className={`text-[10px] ${currentQ.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : currentQ.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'} border-none`}>
                    {currentQ.difficulty}
                  </Badge>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Target className="w-2.5 h-2.5" /> {currentQ.points}pts
                  </span>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {Math.floor((currentQ.timeLimitSeconds || 600) / 60)}m
                  </span>
                </div>
                <div className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {currentQ.description}
                </div>
                {currentQ.examples && (
                  <div className="mt-2">
                    <p className="text-[10px] text-gray-500 uppercase mb-1">Examples</p>
                    <pre className="text-xs text-gray-400 bg-gray-800 rounded p-2 whitespace-pre-wrap font-mono">
                      {currentQ.examples}
                    </pre>
                  </div>
                )}
                {currentQ.constraints && (
                  <div className="mt-2">
                    <p className="text-[10px] text-gray-500 uppercase mb-1">Constraints</p>
                    <p className="text-xs text-gray-400">{currentQ.constraints}</p>
                  </div>
                )}
              </div>

              {/* Editor + Execution panel */}
              <div className="flex-1 flex overflow-hidden">
                {/* Code Editor */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <CodeEditor
                    value={getCurrentCode()}
                    onChange={setCurrentCode}
                    language={getCurrentLang()}
                    languages={filteredLanguages}
                    onLanguageChange={setCurrentLang}
                    starterCode={starterCode}
                  />
                </div>

                {/* Execution panel (right side) */}
                <div className="w-[380px] shrink-0 border-l border-gray-800 flex flex-col overflow-hidden">
                  <CodeExecutionPanel
                    stdin={stdin}
                    onStdinChange={setStdin}
                    executionResult={executionResult}
                    testCaseResults={testCaseResults}
                    isRunning={running || runningSamples}
                    isSubmitting={submitting}
                    onRun={handleRun}
                    onRunSamples={handleRunSamples}
                    onSubmit={handleSubmit}
                    submissionScore={currentSubmission?.score ?? null}
                    submissionStatus={currentSubmission?.statusDescription ?? null}
                    showSubmit
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">No questions loaded</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Finish Confirmation Dialog ──────────────────────── */}
      <Dialog open={finishOpen} onOpenChange={setFinishOpen}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Finish Assessment?</DialogTitle>
            <DialogDescription className="text-gray-400">
              {submittedCount < questions.length ? (
                <>
                  You have submitted {submittedCount} out of {questions.length} questions.
                  <span className="text-amber-400 font-medium"> {questions.length - submittedCount} questions are unanswered.</span>
                </>
              ) : (
                `All ${questions.length} questions submitted. Ready to finish?`
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setFinishOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Keep Working
            </Button>
            <Button
              onClick={handleFinish}
              disabled={finishing}
              className="bg-lime-500 hover:bg-lime-600 text-black font-bold"
            >
              {finishing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Flag className="w-4 h-4 mr-2" />}
              Finish Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
