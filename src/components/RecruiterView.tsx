import React from 'react';
import { EvaluationResponse } from '../types/evaluation';

interface RecruiterViewProps {
  data: EvaluationResponse;
}

const RecruiterView: React.FC<RecruiterViewProps> = ({ data }) => {
  const { profile, scores, recruiter_summary } = data;

  const getRecommendationStyle = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong Yes':
        return {
          bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
          border: 'border-green-300',
          text: 'text-green-800',
          badge: 'bg-green-500'
        };
      case 'Yes':
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
          border: 'border-blue-300',
          text: 'text-blue-800',
          badge: 'bg-blue-500'
        };
      case 'Maybe':
        return {
          bg: 'bg-gradient-to-r from-yellow-50 to-orange-50',
          border: 'border-yellow-300',
          text: 'text-yellow-800',
          badge: 'bg-yellow-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-red-50 to-pink-50',
          border: 'border-red-300',
          text: 'text-red-800',
          badge: 'bg-red-500'
        };
    }
  };

  const getLevelColor = (level: string) => {
    const colors = {
      Beginner: 'text-yellow-600',
      Intermediate: 'text-blue-600',
      Senior: 'text-purple-600',
      Expert: 'text-green-600'
    };
    return colors[level as keyof typeof colors] || 'text-gray-600';
  };

  const recommendationStyle = getRecommendationStyle(recruiter_summary.hiring_recommendation);

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 w-full max-w-6xl mx-auto px-2 sm:px-3 md:px-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6">
          <img 
            src={profile.avatar} 
            alt={profile.name}
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-3 sm:border-4 border-gray-100 shadow-md"
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">{profile.name || profile.username}</h2>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-2">{profile.bio}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-gray-500">
              {profile.location && (
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>{profile.location}</span>
                </span>
              )}
              <span className={`px-2 py-1 rounded-full ${profile.activity_status === 'Active' ? 'bg-green-100 text-green-700' : profile.activity_status === 'Semi-active' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {profile.activity_status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hiring Decision Card */}
      <div className={`${recommendationStyle.bg} ${recommendationStyle.border} border-2 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-lg`}>
        <div className="mb-3 sm:mb-4">
          <div className="inline-flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
            <div className={`w-2 h-2 sm:w-3 sm:h-3 ${recommendationStyle.badge} rounded-full animate-pulse`}></div>
            <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Hiring Recommendation</span>
            <div className={`w-2 h-2 sm:w-3 sm:h-3 ${recommendationStyle.badge} rounded-full animate-pulse`}></div>
          </div>
        </div>
        
        <div className={`inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-full text-xl sm:text-2xl md:text-3xl font-bold ${recommendationStyle.text} bg-white/60 border-2 ${recommendationStyle.border} shadow-sm mb-3 sm:mb-4`}>
          {recruiter_summary.hiring_recommendation}
        </div>

        <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-3 sm:mb-4 px-2">
          {recruiter_summary.recommended_role_level}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-3xl mx-auto">
          <div className="bg-white/80 rounded-lg p-3 border border-gray-200">
            <div className={`text-2xl sm:text-3xl font-bold ${getLevelColor(scores.overall_level)} mb-1`}>
              {scores.overall_level}
            </div>
            <div className="text-xs text-gray-600">Skill Level</div>
          </div>
          <div className="bg-white/80 rounded-lg p-3 border border-gray-200">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{scores.job_readiness_score}%</div>
            <div className="text-xs text-gray-600">Job Ready</div>
          </div>
          <div className="bg-white/80 rounded-lg p-3 border border-gray-200">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">{scores.tech_depth_score}%</div>
            <div className="text-xs text-gray-600">Tech Depth</div>
          </div>
          <div className="bg-white/80 rounded-lg p-3 border border-gray-200">
            <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-1">{recruiter_summary.project_maturity_rating}</div>
            <div className="text-xs text-gray-600">Projects</div>
          </div>
        </div>
      </div>

      {/* Key Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {/* Top Strengths */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Top Strengths</h3>
            </div>
            <div className="space-y-3">
              {recruiter_summary.top_strengths.map((strength, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{strength}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risks & Weaknesses */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-5 sm:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Risk Flags</h3>
            </div>
            <div className="space-y-3">
              {recruiter_summary.risks_or_weaknesses.length > 0 ? (
                recruiter_summary.risks_or_weaknesses.map((risk, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-sm text-gray-700 leading-relaxed">{risk}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">No significant risks identified</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Technical Competencies */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
          </svg>
          <span>Technical Stack</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {profile.primary_languages.map((lang, index) => (
            <span key={index} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200">
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Repository Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-700 mb-1">{profile.analyzed_repositories}</div>
          <div className="text-xs text-blue-600">Analyzed Repos</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="text-2xl font-bold text-purple-700 mb-1">{profile.total_repositories}</div>
          <div className="text-xs text-purple-600">Total Repos</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="text-2xl font-bold text-green-700 mb-1">{scores.overall_score}</div>
          <div className="text-xs text-green-600">Overall Score</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="text-2xl font-bold text-orange-700 mb-1">{scores.activity}/20</div>
          <div className="text-xs text-orange-600">Activity Score</div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterView;
