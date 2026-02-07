import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { savedDevsService } from '../utils/savedDevs';
import { toast } from 'sonner';
import BackToDashboard from '../components/BackToDashboard';
import { Search, Inbox, Trash2, Github, MapPin } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
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
              <h1 className="text-heading-sm sm:text-heading font-semibold text-gray-900 tracking-tight mb-2">Saved Developers</h1>
              <p className="text-sm sm:text-base text-gray-600">
                {savedDevs.length === 0 
                  ? 'No developers saved yet' 
                  : `${savedDevs.length} developer${savedDevs.length !== 1 ? 's' : ''} saved`}
              </p>
            </div>

            <Link 
              to="/browse"
              className="flex items-center justify-center space-x-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 active:scale-[0.97] transition-all font-bold text-sm sm:text-base whitespace-nowrap"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Browse More</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {savedDevs.length === 0 ? (
          <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-16 animate-fade-in-up">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6 animate-float">
              <Inbox className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-heading-sm font-semibold text-gray-900 mb-3">No Saved Developers Yet</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
              Start browsing developers and swipe right to save them here!
            </p>
            <Link 
              to="/browse"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 active:scale-[0.97] transition-all font-bold"
            >
              <Search className="w-5 h-5" />
              <span>Browse Developers</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDevs.map((dev) => (
              <div 
                key={dev.username}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
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
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="text-heading-sm font-semibold mb-1">{dev.name || dev.username}</h3>
                  <p className="text-blue-100 text-sm">@{dev.username}</p>
                  {dev.location && (
                    <p className="text-blue-100 text-xs mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {dev.location}</p>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-100">
                      <div className="text-heading-sm font-bold text-blue-600">{dev.level}</div>
                      <div className="text-xs text-gray-600">Level</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-100">
                      <div className="text-heading-sm font-bold text-blue-600">{dev.score}</div>
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
                      className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-[0.97] transition-all text-sm font-bold"
                    >
                      <Github className="w-4 h-4" />
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
