import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'Freelancer' | 'BusinessOwner';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/auth/signin'
}) => {
  const { user, loading } = useAuth();

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
        <RedirectToSignIn />
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