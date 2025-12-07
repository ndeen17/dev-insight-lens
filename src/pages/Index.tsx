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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-black">
              Artemis AI
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              GitHub profile analysis powered by AI
            </p>
            <div className="flex items-center justify-center space-x-4">
              <HealthCheck />
              <a 
                href="/leaderboard"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 text-white font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>Leaderboard</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white border-2 border-gray-200 rounded-[2rem] p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-black mb-2">Analyze a GitHub Profile</h2>
              <p className="text-gray-600">Enter a GitHub profile URL</p>
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
      <footer className="mt-16 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center text-gray-500 text-sm">
          <p>Powered by GPT-4</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
