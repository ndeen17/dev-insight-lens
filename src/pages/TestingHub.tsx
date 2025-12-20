import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Briefcase, Home } from 'lucide-react';

const TestingHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center">
            <Link to="/" className="text-gray-600 hover:text-black transition-colors text-sm mb-4 inline-flex items-center">
              <Home className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-black">
              Testing Platform
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your role to continue
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recruiter/Employer Card */}
          <button
            onClick={() => navigate('/employer/onboarding')}
            className="text-left border-2 border-gray-200 rounded-xl p-8 hover:border-black transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-black">Recruiter</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Create tests, send invitations, and track candidate performance
            </p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <div className="w-1 h-1 bg-black rounded-full mt-2"></div>
                <span>Define role requirements</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1 h-1 bg-black rounded-full mt-2"></div>
                <span>Use pre-built or custom tests</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1 h-1 bg-black rounded-full mt-2"></div>
                <span>Generate unique test links</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1 h-1 bg-black rounded-full mt-2"></div>
                <span>View results and insights</span>
              </li>
            </ul>
          </button>

          {/* Candidate Card */}
          <button
            onClick={() => navigate('/candidate/enter-code')}
            className="text-left border-2 border-gray-200 rounded-xl p-8 hover:border-black transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-black">Candidate</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Take an assessment using your unique invitation link
            </p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <div className="w-1 h-1 bg-black rounded-full mt-2"></div>
                <span>Access via invitation link</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1 h-1 bg-black rounded-full mt-2"></div>
                <span>Timed assessment</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1 h-1 bg-black rounded-full mt-2"></div>
                <span>Professional code editor</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1 h-1 bg-black rounded-full mt-2"></div>
                <span>Instant submission</span>
              </li>
            </ul>
          </button>
        </div>

        {/* Demo Access */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-4">Want to explore without commitment?</p>
          <Link 
            to="/test-candidate/demo"
            className="inline-flex items-center text-sm text-gray-900 hover:text-black font-medium"
          >
            Try Demo Tests →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestingHub;
