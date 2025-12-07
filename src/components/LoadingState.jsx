const LoadingState = () => {
  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-12">
        {/* Animated Logo */}
        <div className="relative inline-flex items-center justify-center w-full mb-8">
          {/* Outer rings */}
          <div className="absolute w-24 h-24 border-4 border-indigo-200 rounded-full animate-ping opacity-20"></div>
          <div className="absolute w-20 h-20 border-4 border-purple-300 rounded-full animate-spin"></div>
          <div className="absolute w-16 h-16 border-4 border-pink-400 rounded-full animate-pulse"></div>
          
          {/* Center icon */}
          <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">Analyzing Profile</h3>
          
          {/* Progress steps */}
          <div className="space-y-3 max-w-md mx-auto">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">Fetching GitHub profile</span>
            </div>
            
            <div className="flex items-center space-x-3 text-left">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-sm text-gray-900 font-medium">Analyzing repositories...</span>
            </div>
            
            <div className="flex items-center space-x-3 text-left">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
              <span className="text-sm text-gray-400">Generating AI insights</span>
            </div>
          </div>
          
          {/* Animated dots */}
          <div className="flex items-center justify-center space-x-2 pt-4">
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          
          <p className="text-sm text-gray-500 pt-2">
            This may take 30-60 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;