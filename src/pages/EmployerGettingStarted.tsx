import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { useUser } from '@clerk/clerk-react';
import { FileCheck, Users2, ClipboardList, LayoutDashboard, CheckCircle, ArrowRight } from 'lucide-react';

const EmployerGettingStarted = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const firstName = user?.firstName || 'there';

  const options = [
    {
      icon: FileCheck,
      title: 'Create a Contract',
      description: 'Hire a specific developer you already know',
      path: ROUTES.CREATE_CONTRACT,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    {
      icon: Users2,
      title: 'Browse Top Talent',
      description: 'Discover developers on our leaderboard',
      path: '/browse',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
    },
    {
      icon: ClipboardList,
      title: 'Test a Developer',
      description: 'Send a coding test to evaluate skills',
      path: '/employer/onboarding',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Artemis, {firstName}! 🎉
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            You're all set! Choose what you'd like to do first, or skip to your dashboard to explore all features.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.path}
                onClick={() => navigate(option.path)}
                className="bg-white rounded-xl border border-gray-200 p-8 hover:border-gray-900 hover:shadow-lg transition-all duration-200 text-left group"
              >
                <div className={`w-14 h-14 ${option.iconBg} rounded-lg flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${option.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {option.description}
                </p>
                <div className="flex items-center text-gray-900 font-medium text-sm group-hover:text-blue-600 transition-colors">
                  <span>Get started</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Features List */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h3 className="text-base font-semibold text-gray-900 mb-4">What you can do with Artemis:</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm">Analyze developer GitHub profiles with AI</span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm">Send custom coding assessments</span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm">Create and manage contracts with milestones</span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm">Track payments and project progress</span>
            </div>
          </div>
        </div>

        {/* Skip to Dashboard */}
        <div className="text-center">
          <button
            onClick={() => navigate('/employer/dashboard')}
            className="inline-flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all group"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Skip - Go to Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-gray-500 mt-3">
            You can always access these features from your dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployerGettingStarted;
