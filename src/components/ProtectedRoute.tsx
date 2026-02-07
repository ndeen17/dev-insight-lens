import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/config/constants';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'Freelancer' | 'BusinessOwner';
  redirectTo?: string;
}

const RETURN_URL_KEY = 'artemis_return_url';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/auth/signin'
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Check if the URL carries a recipientRole param (from contract invitation emails)
  const recipientRole = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('recipientRole') as 'Freelancer' | 'BusinessOwner' | null;
  }, [location.search]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        {/* Save the intended URL so we can redirect back after auth */}
        {(() => {
          const returnUrl = location.pathname + location.search;
          sessionStorage.setItem(RETURN_URL_KEY, returnUrl);
          return null;
        })()}

        {/* If the URL carries a recipientRole (from invitation email),
            send the user directly to the correct signup page instead
            of the generic sign-in screen. */}
        {recipientRole === 'Freelancer' ? (
          <Navigate to={ROUTES.SIGN_UP_FREELANCER} replace />
        ) : recipientRole === 'BusinessOwner' ? (
          <Navigate to={ROUTES.SIGN_UP_BUSINESS} replace />
        ) : (
          <RedirectToSignIn afterSignInUrl={location.pathname + location.search} />
        )}
      </SignedOut>
      
      <SignedIn>
        {/* Check role if required */}
        {requiredRole && user && user.role !== requiredRole ? (
          <Navigate 
            to={user.role === 'Freelancer' ? '/freelancer/dashboard' : '/employer/dashboard'} 
            replace 
          />
        ) : (
          children
        )}
      </SignedIn>
    </>
  );
};

export default ProtectedRoute;