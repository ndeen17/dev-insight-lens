import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeaderboard } from '../services/api';
import { savedDevsService } from '../utils/savedDevs';
import { toast } from 'sonner';

const BrowseDevelopers = () => {
  const [developers, setDevelopers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    fetchDevelopers();
    updateSavedCount();
  }, []);

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      const result = await getLeaderboard({ limit: 100 });
      setDevelopers(result.data || []);
    } catch (error) {
      console.error('Failed to fetch developers:', error);
      toast.error('Failed to load developers');
    } finally {
      setLoading(false);
    }
  };

  const updateSavedCount = () => {
    setSavedCount(savedDevsService.getSavedCount());
  };

  const handleSwipe = (direction) => {
    if (currentIndex >= developers.length) return;

    setSwipeDirection(direction);

    if (direction === 'right') {
      const dev = developers[currentIndex];
      const saved = savedDevsService.saveDev({
        username: dev.username,
        name: dev.name,
        avatar: dev.avatar,
        level: dev.overall_level,
        score: dev.overall_score,
        location: dev.location,
        github_url: dev.github_url,
        primary_languages: dev.primary_languages
      });

      if (saved) {
        toast.success(`${dev.username} saved!`, {
          description: 'Added to your saved developers'
        });
        updateSavedCount();
      }
    }

    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex(currentIndex + 1);
    }, 300);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') handleSwipe('left');
    if (e.key === 'ArrowRight') handleSwipe('right');
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, developers]);

  const currentDev = developers[currentIndex];
  const isFinished = currentIndex >= developers.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading developers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>

          <h1 className="text-2xl font-bold text-black">Browse Developers</h1>

          <Link 
            to="/saved" 
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>Saved ({savedCount})</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        {!isFinished ? (
          <>
            {/* Progress */}
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                Developer {currentIndex + 1} of {developers.length}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / developers.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Card */}
            <div 
              className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
                swipeDirection === 'left' ? 'transform -translate-x-full opacity-0' :
                swipeDirection === 'right' ? 'transform translate-x-full opacity-0' : ''
              }`}
            >
              {/* Avatar & Header */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white">
                <div className="flex items-center space-x-4">
                  <img 
                    src={currentDev.avatar} 
                    alt={currentDev.username}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold">{currentDev.name || currentDev.username}</h2>
                    <p className="text-blue-100">@{currentDev.username}</p>
                    {currentDev.location && (
                      <p className="text-blue-100 text-sm mt-1">📍 {currentDev.location}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="p-8">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
                    <div className="text-3xl font-bold text-blue-600">{currentDev.overall_level}</div>
                    <div className="text-sm text-gray-600">Skill Level</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
                    <div className="text-3xl font-bold text-blue-600">{currentDev.overall_score}</div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>
                </div>

                {/* Languages */}
                {currentDev.primary_languages && currentDev.primary_languages.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Primary Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentDev.primary_languages.map((lang, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* GitHub Link */}
                <a 
                  href={currentDev.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  <span>View GitHub Profile</span>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center items-center space-x-8 mt-8">
              <button
                onClick={() => handleSwipe('left')}
                className="w-20 h-20 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:border-red-500 hover:text-red-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <button
                onClick={() => handleSwipe('right')}
                className="w-20 h-20 bg-white border-4 border-blue-600 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Keyboard Hint */}
            <div className="text-center mt-6 text-sm text-gray-500">
              Use arrow keys: ← Pass | → Save
            </div>
          </>
        ) : (
          <div className="text-center bg-white rounded-3xl shadow-xl p-12">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-black mb-4">You've seen all developers!</h2>
            <p className="text-gray-600 mb-8">
              {savedCount > 0 
                ? `You saved ${savedCount} developer${savedCount !== 1 ? 's' : ''}!` 
                : "You didn't save any developers this time."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/saved"
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold"
              >
                View Saved Developers
              </Link>
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  fetchDevelopers();
                }}
                className="px-6 py-3 bg-gray-200 text-black rounded-full hover:bg-gray-300 transition-colors font-semibold"
              >
                Browse Again
              </button>
              <Link 
                to="/"
                className="px-6 py-3 bg-white border-2 border-gray-200 text-black rounded-full hover:bg-gray-50 transition-colors font-semibold"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseDevelopers;
