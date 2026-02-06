import { SignUp } from '@clerk/clerk-react';
import { Code2, LogIn } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES, USER_ROLES } from '@/config/constants';
import { logger } from '@/utils/logger';

const FreelancerSignup = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const verificationSent = useRef(false);

  // Ensure role is set and send verification email after signup
  useEffect(() => {
    const handlePostSignup = async () => {
      if (isLoaded && user) {
        const currentRole = user.publicMetadata?.role || user.unsafeMetadata?.role;
        logger.auth.signUp('Freelancer signup - checking role', { 
          userId: user.id,
          role: currentRole,
          hasPublicMetadata: !!user.publicMetadata?.role,
          hasUnsafeMetadata: !!user.unsafeMetadata?.role
        });
        
        // Always ensure role is set correctly
        if (currentRole !== USER_ROLES.FREELANCER) {
          logger.auth.error('Role missing or wrong after signup, setting now', { userId: user.id, currentRole });
          try {
            await user.update({
              unsafeMetadata: {
                ...((user.unsafeMetadata as Record<string, unknown>) || {}),
                role: USER_ROLES.FREELANCER,
              },
            });
            // Reload user to get updated metadata
            await user.reload();
            logger.auth.success('Freelancer role set successfully');
          } catch (error) {
            logger.auth.error('Failed to set role', error);
          }
        }

        // Send verification email (only once)
        const emailAddress = user.primaryEmailAddress;
        if (emailAddress && emailAddress.verification?.status !== 'verified' && !verificationSent.current) {
          verificationSent.current = true;
          try {
            const verifyUrl = `${window.location.origin}${ROUTES.EMAIL_VERIFIED}`;
            await emailAddress.prepareVerification({ strategy: 'email_link', redirectUrl: verifyUrl });
            logger.auth.success('Verification email sent', { email: emailAddress.emailAddress });
          } catch (error) {
            logger.auth.error('Failed to send verification email', error);
          }
        }
        
        // Navigate to dashboard
        navigate(ROUTES.FREELANCER_DASHBOARD, { replace: true });
      }
    };
    handlePostSignup();
  }, [user, isLoaded, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Code2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold">Freelancer Sign Up</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join as a freelance developer
          </p>
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-xs text-amber-700 dark:text-amber-300">
              ⚠️ Note: Each email can only be used for one account type (Freelancer or Employer)
            </p>
          </div>
        </div>
        
        <SignUp 
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-xl',
            }
          }}
          unsafeMetadata={{
            role: USER_ROLES.FREELANCER
          }}
          routing="path"
          path={ROUTES.SIGN_UP_FREELANCER}
          signInUrl={ROUTES.SIGN_IN}
          afterSignUpUrl={ROUTES.FREELANCER_DASHBOARD}
          fallbackRedirectUrl={ROUTES.SIGN_IN}
        />
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
            <LogIn className="w-5 h-5" />
            <p className="text-sm font-medium">
              Already have an account?{' '}
              <Link 
                to={ROUTES.SIGN_IN} 
                className="underline hover:text-green-800 dark:hover:text-green-200 font-semibold"
              >
                Sign in here
              </Link>
            </p>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
            If you see "That email is already taken", you already have an account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreelancerSignup;
