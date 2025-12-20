import { useState } from 'react';
import { Link } from 'react-router-dom';
import { demoTests } from '../data/demoTests';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Clock, FileQuestion, TrendingUp, Code2, Brain, Users } from 'lucide-react';

const TestSelection = () => {
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePosition, setCandidatePosition] = useState('');
  const [showCandidateForm, setShowCandidateForm] = useState(true);

  const handleSkipDemo = () => {
    setShowCandidateForm(false);
  };

  const storeCandidateInfo = (testId: string) => {
    if (candidateName || candidateEmail || candidatePosition) {
      localStorage.setItem('candidate_info', JSON.stringify({
        name: candidateName,
        email: candidateEmail,
        position: candidatePosition
      }));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Hard':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'coding':
        return <Code2 className="w-5 h-5" />;
      case 'cognitive':
        return <Brain className="w-5 h-5" />;
      case 'personality':
        return <Users className="w-5 h-5" />;
      default:
        return <FileQuestion className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="text-gray-600 hover:text-black transition-colors text-sm mb-2 inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-black">Select Assessment</h1>
              <p className="text-gray-600 mt-2">Choose a test to evaluate candidate skills</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Candidate Info Form */}
        {showCandidateForm && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Candidate Information (Optional)</CardTitle>
              <CardDescription>
                Add candidate details to track results, or skip to try the demo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Candidate Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    placeholder="Full-Stack Developer"
                    value={candidatePosition}
                    onChange={(e) => setCandidatePosition(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleSkipDemo}>
                Skip - Try Demo
              </Button>
              <Button onClick={handleSkipDemo} className="bg-blue-600 hover:bg-blue-700">
                Continue
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Available Tests */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-black mb-2">Available Assessments</h2>
            <p className="text-gray-600">Select a test to begin the candidate evaluation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoTests.map((test) => (
              <Card key={test.id} className="hover:shadow-xl transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      {getCategoryIcon(test.category)}
                    </div>
                    <Badge className={`${getDifficultyColor(test.difficulty)} border-2`}>
                      {test.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{test.title}</CardTitle>
                  <CardDescription className="mt-2">{test.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{test.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileQuestion className="w-4 h-4" />
                      <span>{test.questions.length} questions</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Skills Covered:</p>
                    <div className="flex flex-wrap gap-1">
                      {test.skillsCovered.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/test-candidate/${test.id}`} className="w-full" onClick={() => storeCandidateInfo(test.id)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Start Test
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSelection;
