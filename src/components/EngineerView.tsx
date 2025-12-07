import React from 'react';
import { EvaluationResponse } from '../types/evaluation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

interface EngineerViewProps {
  data: EvaluationResponse;
}

const EngineerView: React.FC<EngineerViewProps> = ({ data }) => {
  const { profile, scores, engineer_breakdown } = data;

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 w-full max-w-7xl mx-auto px-2 sm:px-3 md:px-4">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-purple-200 shadow-sm p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <img 
            src={profile.avatar} 
            alt={profile.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg"
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{profile.name || profile.username}</h2>
            <p className="text-gray-600 text-sm sm:text-base mb-3">{profile.bio}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${scores.overall_level === 'Expert' ? 'bg-green-500 text-white' : scores.overall_level === 'Senior' ? 'bg-purple-500 text-white' : scores.overall_level === 'Intermediate' ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-white'}`}>
                {scores.overall_level} Developer
              </span>
              <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-700 border border-gray-200">
                Score: {scores.overall_score}/110
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 md:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <span>Detailed Score Breakdown</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Code Quality', score: scores.code_quality, max: 20 },
            { label: 'Project Diversity', score: scores.project_diversity, max: 20 },
            { label: 'Activity', score: scores.activity, max: 20 },
            { label: 'Architecture', score: scores.architecture, max: 20 },
            { label: 'Repository Quality', score: scores.repo_quality, max: 20 },
            { label: 'Professionalism', score: scores.professionalism, max: 10 },
          ].map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${getScoreColor(item.score, item.max)}`}>
                  {item.score}/{item.max}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${item.score / item.max >= 0.8 ? 'bg-green-500' : item.score / item.max >= 0.6 ? 'bg-blue-500' : item.score / item.max >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${(item.score / item.max) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="patterns" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-2">
          <TabsTrigger value="patterns" className="text-xs sm:text-sm">Code Patterns</TabsTrigger>
          <TabsTrigger value="architecture" className="text-xs sm:text-sm">Architecture</TabsTrigger>
          <TabsTrigger value="testing" className="text-xs sm:text-sm">Testing</TabsTrigger>
          <TabsTrigger value="languages" className="text-xs sm:text-sm">Languages</TabsTrigger>
          <TabsTrigger value="repos" className="text-xs sm:text-sm">Repositories</TabsTrigger>
        </TabsList>

        {/* Code Patterns Tab */}
        <TabsContent value="patterns" className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
              <span>Code Patterns Observed</span>
            </h3>
            {engineer_breakdown.code_patterns.length > 0 ? (
              <div className="space-y-3">
                {engineer_breakdown.code_patterns.map((pattern, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 leading-relaxed">{pattern}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No specific patterns identified yet.</p>
            )}
          </div>

          {/* Complexity Insights */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span>Complexity Insights</span>
            </h3>
            {engineer_breakdown.complexity_insights.length > 0 ? (
              <div className="space-y-3">
                {engineer_breakdown.complexity_insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No complexity analysis available.</p>
            )}
          </div>

          {/* Commit Quality */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
              <span>Commit Message Quality</span>
            </h3>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <p className="text-sm text-gray-700">{engineer_breakdown.commit_message_quality || 'Not analyzed'}</p>
            </div>
          </div>
        </TabsContent>

        {/* Architecture Tab */}
        <TabsContent value="architecture" className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <span>Architecture Analysis</span>
            </h3>
            {engineer_breakdown.architecture_analysis.length > 0 ? (
              <div className="space-y-3">
                {engineer_breakdown.architecture_analysis.map((analysis, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{analysis}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No architecture patterns identified.</p>
            )}
          </div>
        </TabsContent>

        {/* Testing Tab */}
        <TabsContent value="testing" className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Testing Analysis</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className={`p-4 rounded-lg border-2 ${engineer_breakdown.testing_analysis.test_presence ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {engineer_breakdown.testing_analysis.test_presence ? (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  )}
                  <span className="font-semibold text-gray-900">Tests Present</span>
                </div>
                <p className={`text-sm ${engineer_breakdown.testing_analysis.test_presence ? 'text-green-700' : 'text-red-700'}`}>
                  {engineer_breakdown.testing_analysis.test_presence ? 'Test files detected' : 'No tests found'}
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                  <span className="font-semibold text-gray-900">Test Libraries</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {engineer_breakdown.testing_analysis.test_libraries_seen.length > 0 ? (
                    engineer_breakdown.testing_analysis.test_libraries_seen.map((lib, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">{lib}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">None detected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages" className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
              </svg>
              <span>Language Breakdown</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(engineer_breakdown.language_breakdown).map(([language, data], index) => (
                <div key={index} className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{language}</span>
                    <Badge className="bg-orange-500 text-white">{data.percentage}%</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{data.repos_count} repositories</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400"
                      style={{ width: `${data.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Repositories Tab */}
        <TabsContent value="repos" className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              <span>Repository-Level Analysis</span>
            </h3>
            <div className="space-y-3">
              {engineer_breakdown.repo_level_details.length > 0 ? (
                engineer_breakdown.repo_level_details.map((repo, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{repo.repo_name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(repo.score, 100)}`}>
                        {repo.score}/100
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{repo.notes}</p>
                    {repo.languages && repo.languages.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {repo.languages.map((lang, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{lang}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">No detailed repository analysis available.</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EngineerView;
