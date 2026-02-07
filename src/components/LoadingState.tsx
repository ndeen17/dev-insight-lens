import { useState, useEffect } from 'react';

const LoadingState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 3000);
    const timer2 = setTimeout(() => setCurrentStep(2), 8000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const LoadingDots = () => (
    <span className="inline-flex ml-1">
      <span className="w-1 h-1 bg-blue-600 rounded-full animate-pulse mx-0.5"></span>
      <span className="w-1 h-1 bg-blue-600 rounded-full animate-pulse mx-0.5" style={{ animationDelay: '200ms' }}></span>
      <span className="w-1 h-1 bg-blue-600 rounded-full animate-pulse mx-0.5" style={{ animationDelay: '400ms' }}></span>
    </span>
  );

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Progress messages */}
          <div className="w-full space-y-3">
            {/* Step 1: Fetching GitHub profile */}
            <div 
              className={`flex items-center justify-between p-3 bg-blue-50 border-2 border-blue-100 rounded-lg transition-all duration-300 ${
                currentStep === 0 ? 'opacity-100' : currentStep > 0 ? 'opacity-50 blur-sm' : 'opacity-30 blur-sm'
              }`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-sm font-medium text-black">
                  Fetching GitHub profile{currentStep === 0 && <LoadingDots />}
                </p>
              </div>
              {currentStep > 0 && (
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            
            {/* Step 2: Analyzing repositories */}
            <div 
              className={`flex items-center justify-between p-3 bg-blue-50 border-2 border-blue-100 rounded-lg transition-all duration-300 ${
                currentStep === 1 ? 'opacity-100' : currentStep > 1 ? 'opacity-50 blur-sm' : 'opacity-30 blur-sm'
              }`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <p className="text-sm font-medium text-black">
                  Analyzing repositories{currentStep === 1 && <LoadingDots />}
                </p>
              </div>
              {currentStep > 1 && (
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            
            {/* Step 3: Generating AI insights */}
            <div 
              className={`flex items-center justify-between p-3 bg-blue-50 border-2 border-blue-100 rounded-lg transition-all duration-300 ${
                currentStep === 2 ? 'opacity-100' : 'opacity-30 blur-sm'
              }`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-sm font-medium text-black">
                  Generating AI insights{currentStep === 2 && <LoadingDots />}
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">This may take 30-60 seconds</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;