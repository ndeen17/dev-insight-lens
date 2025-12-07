const LoadingState = () => {
  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4">
      {/* Mobile-optimized card */}
      <div className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 rounded-xl sm:rounded-2xl shadow-2xl border-2 border-indigo-100 p-4 sm:p-6 md:p-8 overflow-hidden relative">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Animated Logo - Mobile optimized */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="relative">
              {/* Outer rings - smaller on mobile */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-indigo-200 rounded-full animate-ping opacity-20"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-transparent border-t-purple-500 border-r-purple-500 rounded-full animate-spin"></div>
              </div>
              
              {/* Center icon - responsive sizing */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Loading text - mobile optimized */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Analyzing Profile
            </h3>
            
            {/* Progress steps - better mobile layout */}
            <div className="space-y-2 sm:space-y-3 max-w-md mx-auto">
              <div className="flex items-center space-x-2 sm:space-x-3 bg-white/60 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-green-200">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm text-gray-700 font-medium">Fetching GitHub profile</span>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 sm:p-3 border-2 border-blue-300 shadow-md">
                <div className="relative w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-50"></div>
                </div>
                <span className="text-xs sm:text-sm text-gray-900 font-bold">Analyzing repositories...</span>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3 bg-white/40 rounded-lg p-2 sm:p-3 border border-gray-200">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
                <span className="text-xs sm:text-sm text-gray-400">Generating AI insights</span>
              </div>
            </div>
            
            {/* Animated dots - mobile optimized */}
            <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 pt-3 sm:pt-4">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full animate-bounce shadow-lg"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.2s'}}></div>
            </div>
            
            {/* Time estimate - mobile friendly */}
            <div className="pt-2 sm:pt-3">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                ⏱️ This may take 30-60 seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;