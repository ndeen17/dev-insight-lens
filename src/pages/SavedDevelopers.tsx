import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { savedDevsService } from '../utils/savedDevs';
import { toast } from 'sonner';
import BackToDashboard from '../components/BackToDashboard';

const SavedDevelopers = () => {
  const [savedDevs, setSavedDevs] = useState([]);

  useEffect(() => {
    loadSavedDevs();
  }, []);

  const loadSavedDevs = () => {
    const devs = savedDevsService.getSavedDevs();
    setSavedDevs(devs);
  };

  const handleRemove = (username) => {
    const removed = savedDevsService.removeDev(username);
    if (removed) {
      toast.success('Developer removed from saved list');
      loadSavedDevs();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all saved developers?')) {
      savedDevsService.clearAll();
      toast.success('All saved developers cleared');
      loadSavedDevs();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <BackToDashboard />

            {savedDevs.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">Saved Developers</h1>
              <p className="text-sm sm:text-base text-gray-600">
                {savedDevs.length === 0 
                  ? 'No developers saved yet' 
                  : `${savedDevs.length} developer${savedDevs.length !== 1 ? 's' : ''} saved`}
              </p>
            </div>

            <Link 
              to="/browse"
              className="flex items-center justify-center space-x-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base whitespace-nowrap"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Browse More</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {savedDevs.length === 0 ? (
          <div className="text-center bg-white rounded-3xl shadow-xl p-16">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-black mb-4">No Saved Developers Yet</h2>
            <p className="text-gray-600 mb-8">
              Start browsing developers and swipe right to save them here!
            </p>
            <Link 
              to="/browse"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Browse Developers</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDevs.map((dev) => (
              <div 
                key={dev.username}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white">
                  <div className="flex items-start justify-between mb-3">
                    <img 
                      src={dev.avatar} 
                      alt={dev.username}
                      className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
                    />
                    <button
                      onClick={() => handleRemove(dev.username)}
                      className="text-white/80 hover:text-white transition-colors"
                      title="Remove from saved"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{dev.name || dev.username}</h3>
                  <p className="text-blue-100 text-sm">@{dev.username}</p>
                  {dev.location && (
                    <p className="text-blue-100 text-xs mt-1">📍 {dev.location}</p>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-100">
                      <div className="text-xl font-bold text-blue-600">{dev.level}</div>
                      <div className="text-xs text-gray-600">Level</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-100">
                      <div className="text-xl font-bold text-blue-600">{dev.score}</div>
                      <div className="text-xs text-gray-600">Score</div>
                    </div>
                  </div>

                  {/* Languages */}
                  {dev.primary_languages && dev.primary_languages.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {dev.primary_languages.slice(0, 3).map((lang, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {lang}
                          </span>
                        ))}
                        {dev.primary_languages.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            +{dev.primary_languages.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Saved Date */}
                  <p className="text-xs text-gray-400 mb-4">
                    Saved {new Date(dev.savedAt).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a 
                      href={dev.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                      <span>GitHub</span>
                    </a>
                    <button
                      onClick={() => handleRemove(dev.username)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedDevelopers;
