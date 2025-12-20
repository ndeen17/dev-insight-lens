import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTestById } from '@/data/demoTests';
import { Question, TestSession } from '@/types/test';
import MCQQuestion from '@/components/questions/MCQQuestion';
import CodingQuestion from '@/components/questions/CodingQuestion';
import ScenarioQuestion from '@/components/questions/ScenarioQuestion';
import LikertScaleQuestion from '@/components/questions/LikertScaleQuestion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';

export default function TakeTest() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const test = testId ? getTestById(testId) : null;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [startTime] = useState<Date>(new Date());
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Initialize timer and load saved session
  useEffect(() => {
    if (!test) return;

    const sessionKey = `test_session_${testId}`;
    const savedSession = localStorage.getItem(sessionKey);

    if (savedSession) {
      try {
        const session: TestSession = JSON.parse(savedSession);
        setAnswers(session.answers);
        setCurrentQuestionIndex(session.currentQuestion);
        
        // Calculate remaining time based on start time
        const elapsed = Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000);
        const remaining = test.duration * 60 - elapsed;
        setTimeRemaining(remaining > 0 ? remaining : 0);
      } catch (error) {
        console.error('Failed to load saved session:', error);
        setTimeRemaining(test.duration * 60);
      }
    } else {
      setTimeRemaining(test.duration * 60);
    }
  }, [test, testId]);

  // Countdown timer
  useEffect(() => {
    // Don't run if test isn't loaded or timeRemaining hasn't been initialized
    if (!test || timeRemaining === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [test, timeRemaining]);

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    if (!test || !testId) return;

    const autoSave = setInterval(() => {
      const session: TestSession = {
        testId,
        candidateName: localStorage.getItem('candidate_info') 
          ? JSON.parse(localStorage.getItem('candidate_info')!).name 
          : undefined,
        startTime,
        answers,
        currentQuestion: currentQuestionIndex,
      };
      localStorage.setItem(`test_session_${testId}`, JSON.stringify(session));
    }, 30000);

    return () => clearInterval(autoSave);
  }, [test, testId, startTime, answers, currentQuestionIndex]);

  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Test Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">The requested test could not be found.</p>
            <Button asChild>
              <Link to="/test-candidate">Back to Test Selection</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isTimeCritical = timeRemaining < 300; // Less than 5 minutes

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    // Clear the session from localStorage
    localStorage.removeItem(`test_session_${testId}`);
    
    // Navigate to results page with answers
    navigate(`/test-candidate/${testId}/results`, {
      state: {
        answers,
        startTime,
        endTime: new Date(),
        test,
      },
    });
  };

  const getAnsweredCount = () => {
    return test.questions.filter(q => answers[q.id] !== undefined).length;
  };

  const renderQuestion = (question: Question) => {
    const answer = answers[question.id];

    switch (question.type) {
      case 'mcq':
        return (
          <MCQQuestion
            question={question}
            value={answer}
            onChange={(value) => handleAnswerChange(question.id, value)}
          />
        );
      case 'coding':
        return (
          <CodingQuestion
            question={question}
            value={answer || question.starterCode || ''}
            onChange={(value) => handleAnswerChange(question.id, value)}
          />
        );
      case 'scenario':
        return (
          <ScenarioQuestion
            question={question}
            value={answer}
            onChange={(value) => handleAnswerChange(question.id, value)}
          />
        );
      case 'likert':
        return (
          <LikertScaleQuestion
            question={question}
            value={answer || 3}
            onChange={(value) => handleAnswerChange(question.id, value)}
          />
        );
      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{test.title}</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {test.questions.length} • {getAnsweredCount()} answered
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isTimeCritical ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
              <Clock className={`h-5 w-5 ${isTimeCritical ? 'animate-pulse' : ''}`} />
              <span className="text-lg font-mono font-bold">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardContent className="pt-6">
            {renderQuestion(currentQuestion)}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowExitDialog(true)}
              className="text-gray-600"
            >
              Save & Exit
            </Button>

            {currentQuestionIndex === test.questions.length - 1 ? (
              <Button
                onClick={() => setShowSubmitDialog(true)}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Submit Test
              </Button>
            ) : (
              <Button onClick={handleNext} className="gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigation Grid */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Question Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {test.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`h-10 rounded-md text-sm font-medium transition-colors ${
                    idx === currentQuestionIndex
                      ? 'bg-blue-600 text-white'
                      : answers[q.id] !== undefined
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {getAnsweredCount()} out of {test.questions.length} questions.
              {getAnsweredCount() < test.questions.length && (
                <span className="block mt-2 text-amber-600 font-medium">
                  ⚠️ {test.questions.length - getAnsweredCount()} question(s) remain unanswered.
                </span>
              )}
              <span className="block mt-2">
                Once submitted, you cannot change your answers. Are you sure you want to submit?
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Answers</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Yes, Submit Test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Save and Exit?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be saved. You can resume this test later from where you left off.
              <span className="block mt-2 text-gray-700">
                Current progress: {getAnsweredCount()} of {test.questions.length} questions answered
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Test</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate('/test-candidate')}>
              Save & Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
