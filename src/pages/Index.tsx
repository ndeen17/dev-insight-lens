import { useState } from 'react';
import { analyzeGitHubProfile } from '../services/api';
import GitHubInput from '../components/GitHubInput';
import LoadingState from '../components/LoadingState';
import ResultsCard from '../components/ResultsCard';
import ErrorMessage from '../components/ErrorMessage';
import WelcomeMessage from '../components/WelcomeMessage';
import HealthCheck from '../components/HealthCheck';
import { ViewMode } from '../components/ModeToggle';

const Index = () => {
  const [appState, setAppState] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [githubUrl, setGithubUrl] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState<ViewMode>('recruiter');

  const handleAnalyze = async (url) => {
    setAppState('loading');
    setError(null);
    setResults(null);

    try {
      const response = await analyzeGitHubProfile(url, false); // Don't submit during analysis
      setResults(response.data);
      setAppState('success');
    } catch (err) {
      setError(err.message);
      setAppState('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="text-center">
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm font-semibold">AI-Powered Developer Insights</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 tracking-tight px-2">
              Artemis AI By Oncode
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-4 sm:mb-6 px-4">
              Comprehensive GitHub profile analysis powered by GPT-4. Get instant insights for hiring decisions or technical deep-dives.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <HealthCheck />
              <a 
                href="/leaderboard"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg border border-white/30 transition-all duration-200 text-white font-medium text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span>🏆 Leaderboard</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 md:p-8">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Analyze a GitHub Profile</h2>
              <p className="text-sm sm:text-base text-gray-600">Enter a GitHub username or profile URL to get started</p>
            </div>
            <GitHubInput 
              value={githubUrl}
              onChange={setGithubUrl}
              onAnalyze={handleAnalyze}
              disabled={appState === 'loading'}
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-6 sm:mt-8">
          {appState === 'idle' && <WelcomeMessage />}
          {appState === 'loading' && <LoadingState />}
          {appState === 'success' && <ResultsCard results={results} mode={viewMode} onModeChange={setViewMode} />}
          {appState === 'error' && <ErrorMessage error={error} onRetry={() => setAppState('idle')} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 sm:mt-16 py-6 sm:py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 text-center text-gray-600 text-xs sm:text-sm">
          <p>Powered by GPT-4 • Analyzes 6 key metrics • Real-time insights</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
