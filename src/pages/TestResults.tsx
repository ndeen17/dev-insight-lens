import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Test, Question } from '@/types/test';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Award, TrendingUp, TrendingDown, Home, RefreshCw, Download, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Editor from '@monaco-editor/react';

export default function TestResults() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { answers, startTime, endTime, test } = location.state as {
    answers: Record<string, any>;
    startTime: Date;
    endTime: Date;
    test: Test;
  };

  if (!test || !answers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">No Results Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Unable to load test results.</p>
            <Button asChild>
              <Link to="/test-candidate">Back to Tests</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate score
  let totalPoints = 0;
  let earnedPoints = 0;

  test.questions.forEach(question => {
    totalPoints += question.points;
    const userAnswer = answers[question.id];

    if (question.type === 'mcq' || question.type === 'scenario') {
      if (userAnswer === question.correctAnswer) {
        earnedPoints += question.points;
      }
    } else if (question.type === 'coding') {
      // For coding, check if any test cases were run (stored separately)
      // For demo, assume partial credit if code exists
      if (userAnswer && userAnswer.length > 50) {
        earnedPoints += question.points * 0.5; // 50% credit for attempting
      }
    } else if (question.type === 'likert') {
      // Likert scales are always scored (no wrong answer)
      earnedPoints += question.points;
    }
  });

  const percentage = Math.round((earnedPoints / totalPoints) * 100);
  const passed = percentage >= 70;
  
  // Calculate duration
  const durationMs = new Date(endTime).getTime() - new Date(startTime).getTime();
  const durationMinutes = Math.floor(durationMs / 60000);
  const durationSeconds = Math.floor((durationMs % 60000) / 1000);

  // Hiring recommendation
  const getRecommendation = () => {
    if (percentage >= 85) return { label: 'Strong Hire', color: 'text-green-700 bg-green-50', icon: TrendingUp };
    if (percentage >= 70) return { label: 'Hire', color: 'text-blue-700 bg-blue-50', icon: TrendingUp };
    if (percentage >= 50) return { label: 'Hire with Reservations', color: 'text-amber-700 bg-amber-50', icon: TrendingDown };
    return { label: 'Not Recommended', color: 'text-red-700 bg-red-50', icon: TrendingDown };
  };

  const recommendation = getRecommendation();
  const RecommendationIcon = recommendation.icon;

  // Save to localStorage
  const saveResultToHistory = () => {
    try {
      const completedTests = JSON.parse(localStorage.getItem('completed_tests') || '[]');
      const candidateInfo = JSON.parse(localStorage.getItem('candidate_info') || '{}');
      
      completedTests.push({
        testId: test.id,
        testTitle: test.title,
        candidateName: candidateInfo.name || 'Anonymous',
        score: percentage,
        earnedPoints,
        totalPoints,
        passed,
        completedAt: new Date().toISOString(),
        duration: `${durationMinutes}m ${durationSeconds}s`,
      });

      localStorage.setItem('completed_tests', JSON.stringify(completedTests));
    } catch (error) {
      console.error('Failed to save result:', error);
    }
  };

  // Save result on mount
  if (typeof window !== 'undefined') {
    saveResultToHistory();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${passed ? 'bg-green-100' : 'bg-amber-100'} mb-4`}>
            {passed ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-amber-600" />
            )}
            <span className={`font-bold text-lg ${passed ? 'text-green-700' : 'text-amber-700'}`}>
              {passed ? 'Test Passed!' : 'Test Completed'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{test.title}</h1>
          <p className="text-gray-600">Assessment Results</p>
        </div>

        {/* Score Card */}
        <Card className="mb-6 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-blue-600" />
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">{percentage}%</div>
                <Progress value={percentage} className="h-3 mb-2" />
                <p className="text-sm text-gray-600">
                  {earnedPoints} / {totalPoints} points
                </p>
              </div>

              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${recommendation.color} mb-2`}>
                  <RecommendationIcon className="h-5 w-5" />
                  <span className="font-bold">{recommendation.label}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Hiring Recommendation</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span className="text-2xl font-bold text-gray-900">
                    {durationMinutes}m {durationSeconds}s
                  </span>
                </div>
                <p className="text-sm text-gray-600">Time Taken</p>
                <p className="text-xs text-gray-500 mt-1">
                  Allocated: {test.duration} minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {test.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = 
                  (question.type === 'mcq' || question.type === 'scenario') 
                    ? userAnswer === question.correctAnswer
                    : question.type === 'likert';

                return (
                  <AccordionItem key={question.id} value={question.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <Badge variant={isCorrect ? "default" : "secondary"} className={isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          Q{index + 1}
                        </Badge>
                        <span className="font-medium">{question.title}</span>
                        <Badge variant="outline" className="ml-auto">
                          {question.points} pts
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">{question.description}</p>
                        </div>

                        {question.type === 'coding' ? (
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Your Code:</p>
                              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                                <Editor
                                  height="200px"
                                  language={question.language}
                                  value={userAnswer || 'No code submitted'}
                                  theme="vs-dark"
                                  options={{
                                    readOnly: true,
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ) : question.type === 'mcq' || question.type === 'scenario' ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Your Answer:</p>
                              <div className={`p-3 rounded-lg ${userAnswer === question.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                <p className="text-sm">
                                  {userAnswer !== undefined ? question.options?.[userAnswer] : 'Not answered'}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Correct Answer:</p>
                              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                                <p className="text-sm">
                                  {question.options?.[question.correctAnswer!]}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : question.type === 'likert' ? (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Your Response:</p>
                            <div className="flex items-center gap-4">
                              <Progress value={(userAnswer / 5) * 100} className="flex-1" />
                              <span className="text-lg font-bold text-blue-600">{userAnswer}/5</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              {question.scaleLabels?.[userAnswer - 1] || 'Response recorded'}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/" className="gap-2">
              <Home className="h-5 w-5" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/test-candidate" className="gap-2">
              <RefreshCw className="h-5 w-5" />
              Test Another Candidate
            </Link>
          </Button>
          <Button variant="default" size="lg" onClick={() => window.print()} className="gap-2">
            <Download className="h-5 w-5" />
            Download Report
          </Button>
        </div>
      </div>
    </div>
  );
}
