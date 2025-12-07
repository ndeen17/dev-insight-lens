import React from 'react';
import { EvaluationResponse } from '../types/evaluation';

interface RecruiterViewProps {
  data: EvaluationResponse;
}

const RecruiterView: React.FC<RecruiterViewProps> = ({ data }) => {
  const { profile, scores, recruiter_summary } = data;

  const getRecommendationStyle = (recommendation: string) => {
    return {
      bg: 'bg-white',
      border: 'border-gray-200',
      text: 'text-black',
      badge: 'bg-blue-600'
    };
  };

  const getLevelColor = (level: string) => {
    return 'text-blue-600';
  };

  const recommendationStyle = getRecommendationStyle(recruiter_summary.hiring_recommendation);

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 w-full max-w-6xl mx-auto px-2 sm:px-3 md:px-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-6">
          <img 
            src={profile.avatar} 
            alt={profile.name}
            className="w-20 h-20 rounded-full border-2 border-blue-200"
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-black mb-1">{profile.name || profile.username}</h2>
            <p className="text-gray-600 mb-2">{profile.bio}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm">
              {profile.location && (
                <span className="flex items-center space-x-1 text-gray-600">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{profile.location}</span>
                </span>
              )}
              <span className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{profile.activity_status}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hiring Decision Card */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center">
        <div className="mb-4 flex items-center justify-center space-x-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <span className="text-xl font-bold text-black">Hiring Recommendation</span>
        </div>
        
        <div className="inline-flex items-center px-6 py-3 rounded-lg text-3xl font-bold text-blue-600 bg-blue-50 border-2 border-blue-200 mb-4">
          {recruiter_summary.hiring_recommendation}
        </div>

        <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-3 sm:mb-4 px-2">
          {recruiter_summary.recommended_role_level}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
            <div className="text-2xl font-bold text-blue-600 mb-1 break-words">
              {scores.overall_level}
            </div>
            <div className="text-xs text-gray-600">Skill Level</div>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">{scores.job_readiness_score}%</div>
            <div className="text-xs text-gray-600">Job Ready</div>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">{scores.tech_depth_score}%</div>
            <div className="text-xs text-gray-600">Tech Depth</div>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">{recruiter_summary.project_maturity_rating}</div>
            <div className="text-xs text-gray-600">Projects</div>
          </div>
        </div>
      </div>

      {/* Key Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Strengths */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-lg font-semibold text-black">Top Strengths</h3>
          </div>
          <div className="space-y-3">
            {recruiter_summary.top_strengths.map((strength, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 border-2 border-blue-100 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{strength}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risks & Weaknesses */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-semibold text-black">Risk Flags</h3>
          </div>
          <div className="space-y-3">
            {recruiter_summary.risks_or_weaknesses.length > 0 ? (
              recruiter_summary.risks_or_weaknesses.map((risk, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 border-2 border-gray-200 rounded-lg">
                  <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

      {/* Technical Competencies */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <h3 className="text-lg font-semibold text-black">Technical Stack</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.primary_languages.map((lang, index) => (
            <span key={index} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium">
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Repository Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
          <div className="text-2xl font-bold text-black mb-1">{profile.analyzed_repositories}</div>
          <div className="text-xs text-gray-600">Analyzed Repos</div>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
          <div className="text-2xl font-bold text-black mb-1">{profile.total_repositories}</div>
          <div className="text-xs text-gray-600">Total Repos</div>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
          <div className="text-2xl font-bold text-black mb-1">{scores.overall_score}</div>
          <div className="text-xs text-gray-600">Overall Score</div>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
          <div className="text-2xl font-bold text-black mb-1">{scores.activity}/20</div>
          <div className="text-xs text-gray-600">Activity Score</div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterView;
