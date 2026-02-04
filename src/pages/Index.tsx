import { useState } from 'react';
import { Link } from 'react-router-dom';
import { analyzeGitHubProfile } from '../services/api';
import GitHubInput from '../components/GitHubInput';
import LoadingState from '../components/LoadingState';
import ResultsCard from '../components/ResultsCard';
import ErrorMessage from '../components/ErrorMessage';
import HealthCheck from '../components/HealthCheck';
import { ViewMode } from '../components/ModeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { GitBranch, ClipboardCheck, TrendingUp, ArrowRight, Briefcase, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const [appState, setAppState] = useState('idle');
  const [githubUrl, setGithubUrl] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState<ViewMode>('recruiter');

  const handleAnalyze = async (url) => {
    setAppState('loading');
    setError(null);
    setResults(null);

    try {
      const response = await analyzeGitHubProfile(url, false);
      setResults(response.data);
      setAppState('success');
    } catch (err) {
      setError(err.message);
      setAppState('error');
    }
  };

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/auth/signin';
    return user?.role === 'BusinessOwner' ? '/employer/dashboard' : '/freelancer/dashboard';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold text-black hover:text-blue-600 transition-colors">
                Artemis AI
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/leaderboard" className="text-gray-600 hover:text-black transition-colors font-medium">
                  Leaderboard
                </Link>
                {isAuthenticated && user?.role === 'BusinessOwner' && (
                  <>
                    <Link to="/browse" className="text-gray-600 hover:text-black transition-colors font-medium">
                      Browse Talent
                    </Link>
                    <Link to="/test-candidate" className="text-gray-600 hover:text-black transition-colors font-medium">
                      Test Candidates
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600 hidden md:inline">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <Button asChild>
                    <Link to={getDashboardLink()}>
                      Dashboard
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/auth/signin">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/auth/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Integrated GitHub Analysis */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-black">
              Artemis Remote Work Platform
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Complete platform for remote work: Hire talent, manage contracts, and track payments
            </p>
            
            <div className="flex items-center justify-center gap-3 mb-8">
              <HealthCheck />
            </div>
          </div>

          {/* GitHub Analysis Widget */}
          <Card className="max-w-2xl mx-auto border-2 border-blue-200 shadow-xl bg-gradient-to-br from-white to-blue-50 mb-8">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-black">GitHub Profile Analysis</CardTitle>
              <CardDescription className="text-gray-600">
                Analyze any GitHub profile with AI-powered insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GitHubInput 
                value={githubUrl}
                onChange={setGithubUrl}
                onAnalyze={handleAnalyze}
                disabled={appState === 'loading'}
              />
            </CardContent>
          </Card>

          <div className="text-center">
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link to="/auth/signup">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Get Started
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link to="/leaderboard">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    View Leaderboard
                  </Link>
                </Button>
              </div>
            ) : (
              <Button asChild size="lg">
                <Link to={getDashboardLink()}>
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {appState !== 'idle' && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          {appState === 'loading' && <LoadingState />}
          {appState === 'success' && <ResultsCard results={results} mode={viewMode} onModeChange={setViewMode} />}
          {appState === 'error' && <ErrorMessage error={error} onRetry={() => setAppState('idle')} />}
        </div>
      )}

      {/* Features Section */}
      <div className="bg-white py-16 md:py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Everything You Need for Remote Work
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From finding talent to managing contracts and payments, all in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-blue-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-7 h-7 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Find Top Talent</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed mb-4">
                  Browse ranked developers based on GitHub activity and AI evaluation. View detailed profiles and hire directly from the leaderboard.
                </CardDescription>
                {!isAuthenticated && (
                  <Button asChild variant="link" className="p-0 h-auto font-semibold">
                    <Link to="/leaderboard">
                      Browse Developers <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-green-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-7 h-7 text-green-600" />
                </div>
                <CardTitle className="text-xl">Manage Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed mb-4">
                  Create fixed-price or hourly contracts with milestone tracking, escrow payments, and automated approval workflows.
                </CardDescription>
                {isAuthenticated ? (
                  <Button asChild variant="link" className="p-0 h-auto font-semibold">
                    <Link to={user?.role === 'BusinessOwner' ? '/employer/contracts/new' : '/freelancer/dashboard'}>
                      View Contracts <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="link" className="p-0 h-auto font-semibold">
                    <Link to="/auth/signup">
                      Get Started <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-purple-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <ClipboardCheck className="w-7 h-7 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Test Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed mb-4">
                  Create and send technical assessments to evaluate candidate skills across multiple programming languages and frameworks.
                </CardDescription>
                {isAuthenticated && user?.role === 'BusinessOwner' ? (
                  <Button asChild variant="link" className="p-0 h-auto font-semibold">
                    <Link to="/test-candidate">
                      Create Test <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                ) : !isAuthenticated && (
                  <Button asChild variant="link" className="p-0 h-auto font-semibold">
                    <Link to="/auth/signup">
                      Get Started <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <p className="text-gray-600 text-sm mb-3 font-medium">Powered by GPT-4</p>
          <div className="text-gray-400 text-xs space-y-1">
            <p>Not affiliated with GitHub, Inc.</p>
            <p>GitHub and the GitHub logo are trademarks of GitHub, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
