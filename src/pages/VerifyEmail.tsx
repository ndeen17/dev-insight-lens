import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { ROUTES } from '@/config/constants';

/**
 * Landing page shown when users click the email verification link.
 * Shows a success message, then auto-redirects to their dashboard.
 */
const VerifyEmail = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [countdown, setCountdown] = useState(3);

  // Determine where to redirect based on user role
  const getDashboardRoute = () => {
    if (!user) return ROUTES.HOME;
    const role = user.publicMetadata?.role || user.unsafeMetadata?.role;
    return role === 'BusinessOwner' ? ROUTES.EMPLOYER_DASHBOARD : ROUTES.FREELANCER_DASHBOARD;
  };

  // Countdown and auto-redirect
  useEffect(() => {
    if (!isLoaded) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(getDashboardRoute(), { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoaded, navigate, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Success animation */}
        <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center animate-in zoom-in-50 duration-500">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>

        <div className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-200">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Email Verified!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Your email has been successfully verified.
          </p>
        </div>

        <div className="animate-in fade-in-0 duration-500 delay-500">
          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <p className="text-sm">
              Redirecting to your dashboard in {countdown}...
            </p>
          </div>

          <button
            onClick={() => navigate(getDashboardRoute(), { replace: true })}
            className="mt-4 text-sm text-blue-700 dark:text-blue-300 underline hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
          >
            Go to dashboard now
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
