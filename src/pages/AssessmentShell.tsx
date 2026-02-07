import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AssessmentChat from '@/components/assessment/AssessmentChat';
import AssessmentTimer from '@/components/assessment/AssessmentTimer';
import SecureInput from '@/components/assessment/SecureInput';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import * as assessmentService from '@/services/assessmentService';
import type { AssessmentSession, Assessment } from '@/types/assessment';
import { ROUTES } from '@/config/constants';

/**
 * AssessmentShell — the full-screen assessment experience.
 * Route: /assessment/session/:id
 *
 * Layout:
 * ┌──────────────────────────────────────────┐
 * │  Header (title, timer, progress)         │
 * ├──────────────────────────────────────────┤
 * │                                          │
 * │           Chat messages                  │
 * │                                          │
 * ├──────────────────────────────────────────┤
 * │  SecureInput + Send button               │
 * └──────────────────────────────────────────┘
 */
const AssessmentShell = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Load the session
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const s = await assessmentService.getSession(id);
        setSession(s);
        // Assessment may be populated or just an ID
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

  // Send an answer
  const handleSend = useCallback(async () => {
    if (!session || !inputValue.trim() || sending) return;
    setSending(true);
    const text = inputValue.trim();
    setInputValue('');

    try {
      const res = await assessmentService.sendMessage(session._id, text);
      setSession(res.session);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Failed to send message.',
        variant: 'destructive',
      });
      // Restore the user's text so they don't lose it
      setInputValue(text);
    } finally {
      setSending(false);
    }
  }, [session, inputValue, sending, toast]);

  // Time-up handler
  const handleTimeUp = useCallback(() => {
    toast({ title: 'Time is up!', description: 'Your assessment has ended.', variant: 'destructive' });
    // Reload to get updated session
    if (id) {
      assessmentService.getSession(id).then(setSession).catch(() => {});
    }
  }, [id, toast]);

  // ─── Loading state ─────────────────────────────────────────
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
        <Button variant="outline" onClick={() => navigate(ROUTES.FREELANCER_DASHBOARD)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  const isComplete = session.status === 'completed' || session.status === 'timed_out';
  const progress = session.totalQuestions > 0
    ? Math.round((session.currentQuestionIndex / session.totalQuestions) * 100)
    : 0;

  // ─── Completed state ───────────────────────────────────────
  if (isComplete) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center space-y-6">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">Assessment Complete</h1>

          {session.score != null && (
            <div className="bg-gray-50 rounded-xl p-6 border">
              <p className="text-5xl font-bold text-gray-900">{session.score}</p>
              <p className="text-sm text-gray-500 mt-1">out of 100</p>
            </div>
          )}

          {session.aiSummary && (
            <p className="text-gray-600 text-sm leading-relaxed">{session.aiSummary}</p>
          )}

          {session.strengths.length > 0 && (
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

          {session.weaknesses.length > 0 && (
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

          {Object.keys(session.breakdown).length > 0 && (
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
            <Button variant="outline" onClick={() => navigate(ROUTES.FREELANCER_DASHBOARD)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Active assessment ─────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex-shrink-0 border-b px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-gray-900 truncate">
              {assessment?.title || 'Skill Assessment'}
            </h1>
            <p className="text-xs text-gray-500">
              Question {session.currentQuestionIndex} of {session.totalQuestions}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress */}
            <div className="hidden sm:flex items-center gap-2 w-32">
              <Progress value={progress} className="h-2" />
              <span className="text-xs text-gray-400 w-8">{progress}%</span>
            </div>

            {/* Timer */}
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

      {/* Chat area */}
      <AssessmentChat messages={session.messages} isLoading={sending} />

      {/* Input bar */}
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
};

export default AssessmentShell;
