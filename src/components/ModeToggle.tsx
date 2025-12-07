import React from 'react';

export type ViewMode = 'recruiter' | 'engineer';

interface ModeToggleProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex justify-center mb-6 sm:mb-8">
      <div className="inline-flex items-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl p-1 sm:p-1.5 shadow-lg border border-gray-300">
        <button
          onClick={() => onModeChange('recruiter')}
          className={`
            relative flex items-center space-x-1.5 sm:space-x-2.5 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-300
            ${mode === 'recruiter'
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl scale-105'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }
          `}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" stroke="currentColor" strokeWidth="0.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          <span>Recruiter</span>
          {mode === 'recruiter' && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          )}
        </button>
        
        <button
          onClick={() => onModeChange('engineer')}
          className={`
            relative flex items-center space-x-1.5 sm:space-x-2.5 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-300
            ${mode === 'engineer'
              ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white shadow-xl scale-105'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }
          `}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
          <span>Engineer</span>
          {mode === 'engineer' && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ModeToggle;
