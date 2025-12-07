const LoadingState = () => {
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Simple moving circle spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          
          {/* Progress messages with icons */}
          <div className="w-full space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
              <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-sm font-medium text-gray-900">Fetching GitHub profile</p>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <p className="text-sm font-medium text-gray-900">Analyzing repositories...</p>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-sm font-medium text-gray-900">Generating AI insights</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">This may take 30-60 seconds</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;