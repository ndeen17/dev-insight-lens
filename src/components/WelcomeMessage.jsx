import { Users, Code2, CheckCircle2 } from 'lucide-react';

const WelcomeMessage = () => (
  <div className="max-w-6xl mx-auto px-3 sm:px-4">
    {/* Feature Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
      {/* Recruiter Mode Card */}
      <div className="group bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
        <div className="mb-4">
          <h4 className="text-xl font-bold text-gray-900">Recruiter Mode</h4>
        </div>
        <p className="text-gray-600 mb-4">
          Fast, actionable insights for hiring decisions
        </p>
        <ul className="space-y-2.5">
          <li className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-700">Skill level & job readiness score</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">Clear hiring recommendation</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">Top strengths & potential risks</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">Technical stack overview</span>
          </li>
        </ul>
      </div>

      {/* Engineer Mode Card */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-5 text-left">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Code2 className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <h4 className="text-xl font-bold text-gray-900">Engineer Mode</h4>
        </div>
        <p className="text-gray-600 mb-4">
          Deep technical breakdown for developers
        </p>
        <ul className="space-y-2.5">
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">Code patterns & architecture</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">Testing & complexity analysis</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">Language proficiency breakdown</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">Repository-level diagnostics</span>
          </li>
        </ul>
      </div>
    </div>

    {/* Info Section */}
    <div className="mt-12 text-center">
      <div className="inline-flex items-center space-x-2 bg-blue-50 px-6 py-3 rounded-full border-2 border-blue-200">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-sm font-medium text-gray-700">Switch between modes after analysis to see different perspectives</span>
      </div>
    </div>

    {/* Stats Section */}
    <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
      <div className="text-center">
        <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">6</div>
        <div className="text-xs sm:text-sm text-gray-600">Key Metrics</div>
      </div>
      <div className="text-center">
        <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">2</div>
        <div className="text-xs sm:text-sm text-gray-600">View Modes</div>
      </div>
      <div className="text-center">
        <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">AI</div>
        <div className="text-xs sm:text-sm text-gray-600">Powered</div>
      </div>
    </div>
  </div>
);

export default WelcomeMessage;