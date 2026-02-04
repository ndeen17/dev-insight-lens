import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    const dashboardRoute = user.role === 'Freelancer' 
      ? '/freelancer/dashboard' 
      : '/employer/dashboard';
    return <Navigate to={dashboardRoute} replace />;
  }

  // User is authenticated and has correct role
  return <>{children}</>;
};

export default ProtectedRoute;
