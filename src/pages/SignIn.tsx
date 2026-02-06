import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { ROUTES } from '@/config/constants';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-6">
        <ClerkSignIn 
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-xl',
            }
          }}
          routing="path"
          path={ROUTES.SIGN_IN}
          signUpUrl={ROUTES.SIGN_UP}
          fallbackRedirectUrl={ROUTES.HOME}
        />
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
            <UserPlus className="w-5 h-5" />
            <p className="text-sm font-medium">
              Don't have an account?{' '}
              <Link 
                to={ROUTES.SIGN_UP} 
                className="underline hover:text-blue-800 dark:hover:text-blue-200 font-semibold"
              >
                Sign up here
              </Link>
            </p>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            If you see "Couldn't find your account", you need to create an account first.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
