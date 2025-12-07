import React, { useState } from 'react';
import ModeToggle, { ViewMode } from './ModeToggle';
import RecruiterView from './RecruiterView';
import EngineerView from './EngineerView';
import { EvaluationResponse, LegacyEvaluationResponse, isNewFormat, isLegacyFormat } from '../types/evaluation';
import { analyzeGitHubProfile } from '../services/api';

interface ResultsCardProps {
  results: EvaluationResponse | LegacyEvaluationResponse;
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ results, mode, onModeChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Handle legacy format (backward compatibility)
  if (isLegacyFormat(results)) {
    return <LegacyResultsView results={results} />;
  }

  // Handle new dual-mode format
  if (isNewFormat(results)) {
    return (
      <div className="space-y-4 sm:space-y-6 w-full">
        <ModeToggle mode={mode} onModeChange={onModeChange} />
        
        {mode === 'recruiter' ? (
          <RecruiterView data={results} />
        ) : (
          <EngineerView data={results} />
        )}

        {/* Leaderboard Join Button */}
        {!results.leaderboard_submitted && (
          <div className="flex justify-center mb-6">
            <button
              onClick={async () => {
                if (isSubmitting) return;
                
                setIsSubmitting(true);
                try {
                  // Extract GitHub URL from results
                  const githubUrl = results.profile.github_url;
                  
                  console.log('Submitting to leaderboard:', githubUrl);
                  
                  // Re-analyze with leaderboard submission flag
                  const response = await analyzeGitHubProfile(githubUrl, true);
                  
                  if (response?.data?.leaderboard_submitted) {
                    alert('🎉 Successfully joined the leaderboard!');
                    // Redirect to leaderboard page
                    window.location.href = '/leaderboard';
                  } else {
                    alert('⚠️ Profile analyzed but leaderboard submission may have failed. Please try again.');
                  }
                } catch (error: any) {
                  console.error('Leaderboard submission error:', error);
                  alert(`Failed to join leaderboard: ${error.message || 'Please try again.'}`);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
              className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span>Click to join leaderboard 🏆</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 px-2">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-bold text-base transform"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Analyze Another Profile</span>
          </button>
          
          <button 
            onClick={() => {
              const shareText = `Check out my GitHub profile analysis: ${results.scores.overall_level} Developer (${results.scores.overall_score}/110 score)`;
              if (navigator.share) {
                navigator.share({ 
                  title: 'Dev Insight Lens - GitHub Analysis',
                  text: shareText,
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(shareText);
                alert('Results copied to clipboard!');
              }
            }}
            className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm sm:text-base"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
            </svg>
            <span>Share Results</span>
          </button>
        </div>
      </div>
    );
  }

  // Fallback for unexpected format
  return (
    <div className="text-center py-8 px-4">
      <p className="text-red-600">Unexpected data format received</p>
    </div>
  );
};

// Legacy view component for backward compatibility
const LegacyResultsView: React.FC<{ results: LegacyEvaluationResponse }> = ({ results }) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'Beginner': return {
        bg: 'bg-gradient-to-r from-yellow-50 to-orange-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-300'
      };
      case 'Intermediate': return {
        bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        badge: 'bg-blue-100 text-blue-800 border-blue-300'
      };
      case 'Advanced': return {
        bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
        border: 'border-green-200',
        text: 'text-green-800',
        badge: 'bg-green-100 text-green-800 border-green-300'
      };
      default: return {
        bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
        border: 'border-gray-200',
        text: 'text-gray-800',
        badge: 'bg-gray-100 text-gray-800 border-gray-300'
      };
    }
  };

  const gradeColors = getGradeColor(results.grade);

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-5xl mx-auto px-2 sm:px-4">
      {/* Main Grade Card */}
      <div className={`${gradeColors.bg} ${gradeColors.border} border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center shadow-lg`}>
        <div className="mb-4 sm:mb-6">
          <div className={`inline-flex items-center px-3 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg font-semibold border-2 ${gradeColors.badge} shadow-sm`}>
            {results.grade} Developer
          </div>
        </div>
        
        <p className={`${gradeColors.text} text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-3 sm:mb-4 px-2`}>
          {results.reasoning}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{results.analyzedRepos} repositories analyzed</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>{results.totalRepos} total repositories</span>
          </div>
        </div>
      </div>

      {/* Analysis Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Strengths</h3>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              {results.strengths.map((strength, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 sm:p-3 bg-green-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{strength}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Areas to Improve</h3>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              {results.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 sm:p-3 bg-orange-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{weakness}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Suggestions</h3>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              {results.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6 sm:pt-8 px-2">
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-gray-900 text-white rounded-lg sm:rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm sm:text-base"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>Analyze Another Profile</span>
        </button>
        
        <button 
          onClick={() => {
            const shareText = `I got ${results.grade} level on GitHub developer analysis!`;
            if (navigator.share) {
              navigator.share({ 
                title: 'Dev Insight Lens',
                text: shareText,
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(shareText);
              alert('Results copied to clipboard!');
            }
          }}
          className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm sm:text-base"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
          </svg>
          <span>Share Results</span>
        </button>
      </div>
    </div>
  );
};

export default ResultsCard;
