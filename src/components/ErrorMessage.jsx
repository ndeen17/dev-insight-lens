import { useState, useEffect } from 'react';
import { isRateLimitError, isNetworkError } from '../utils/errorHandler';

const ErrorMessage = ({ error, onRetry }) => {
  const [countdown, setCountdown] = useState(0);
  const isRateLimit = isRateLimitError({ message: error });
  const isNetwork = isNetworkError({ message: error });

  useEffect(() => {
    if (isRateLimit && countdown === 0) {
      setCountdown(15 * 60);
    }
  }, [isRateLimit]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border-2 border-red-200 p-6 sm:p-8">
        {/* Error Icon */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        {/* Error Message */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Analysis Failed</h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-700 leading-relaxed">{error}</p>
          </div>
          
          {isRateLimit && countdown > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-700">
                Rate limit reached. Try again in <span className="font-bold">{formatTime(countdown)}</span>
              </p>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={onRetry}
            disabled={isRateLimit && countdown > 0}
            className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
              isRateLimit && countdown > 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRateLimit && countdown > 0 ? 'Please Wait' : 'Try Again'}
          </button>
        
          {isNetwork && (
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 font-medium transition-colors"
            >
              Refresh
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;