import { useState } from 'react';

const GitHubInput = ({ value, onChange, onAnalyze, disabled }) => {
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!value.trim()) {
      setIsValid(false);
      return;
    }

    const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-_]+$/;
    if (!githubUrlPattern.test(value.trim())) {
      setIsValid(false);
      return;
    }

    setIsValid(true);
    onAnalyze(value.trim());
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-200">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex-1 relative">
            <input
              type="url"
              value={value}
              onChange={(e) => { onChange(e.target.value); setIsValid(true); }}
              placeholder="https://github.com/username"
              disabled={disabled}
              className={`w-full px-4 py-4 border-2 text-base focus:outline-none transition-all duration-200 ${
                !isValid 
                  ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-400' 
                  : disabled 
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 focus:border-blue-600 bg-white'
              }`}
            />
            {!isValid && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        {!isValid && (
          <div className="flex items-start space-x-2 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">Invalid GitHub URL</p>
              <p className="text-xs text-red-600 mt-1">Please enter a valid GitHub profile URL (e.g., https://github.com/username)</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 ${
            disabled || !value.trim()
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {disabled ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing...</span>
            </div>
          ) : (
            <span>Analyze Profile</span>
          )}
        </button>
        
        {/* Example hint */}
        <p className="text-xs text-center text-gray-500">
          Example: <span className="text-blue-600 font-medium">https://github.com/torvalds</span>
        </p>
      </form>
    </div>
  );
};

export default GitHubInput;