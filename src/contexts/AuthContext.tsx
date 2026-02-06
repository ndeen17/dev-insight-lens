import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { apiClient, setAuthToken, setTokenRefreshCallback } from '@/lib/apiClient';
import { RETRY_CONFIG } from '@/config/constants';
import { logger } from '@/utils/logger';
import type { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  clerkUser: any;
  loading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { getToken, signOut } = useClerkAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Register token refresh callback with apiClient
  useEffect(() => {
    setTokenRefreshCallback(async () => {
      try {
        const token = await getToken();
        logger.debug('Token refresh callback invoked', { hasToken: !!token });
        return token;
      } catch (error) {
        logger.error('Failed to get token in refresh callback', error);
        return null;
      }
    });
  }, [getToken]);

  // Safety timeout: ensure loading never hangs more than 30 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        logger.warn('Loading timeout reached (30s), forcing loading to false');
        setLoading(false);
        
        // If we have Clerk user but no MongoDB user, create fallback
        if (clerkUser && !user) {
          const clerkRole = (clerkUser.publicMetadata?.role || clerkUser.unsafeMetadata?.role) as 'Freelancer' | 'BusinessOwner' | undefined;
          const fallbackUser: User = {
            _id: '',
            clerkId: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            firstName: clerkUser.firstName || '',
            lastName: clerkUser.lastName || '',
            role: clerkRole || 'Freelancer',
            profilePicture: clerkUser.imageUrl,
            isActive: true,
            isEmailVerified: clerkUser.primaryEmailAddress?.verification?.status === 'verified',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUser(fallbackUser);
          logger.info('Using Clerk fallback data after timeout', { role: clerkRole });
        }
      }
    }, 30000); // 30 seconds maximum loading time

    setLoadingTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [loading, clerkUser, user]);

  // Automatic token refresh before expiration
  useEffect(() => {
    if (!clerkUser) return;

    const refreshTokenPeriodically = async () => {
      try {
        // Get fresh token - Clerk will handle expiration internally
        const token = await getToken({ skipCache: false });
        if (token) {
          setAuthToken(token);
          logger.debug('Token refreshed proactively');
        }
      } catch (error) {
        logger.error('Proactive token refresh failed', error);
      }
    };

    // Refresh token every 50 minutes (Clerk tokens typically expire after 60 minutes)
    const refreshInterval = setInterval(refreshTokenPeriodically, 50 * 60 * 1000);

    // Initial immediate refresh
    refreshTokenPeriodically();

    return () => clearInterval(refreshInterval);
  }, [clerkUser, getToken]);

  // Fetch MongoDB user data when Clerk user is available
  useEffect(() => {
    const fetchMongoUser = async () => {
      if (!clerkLoaded) {
        logger.auth.loading('Clerk not loaded yet');
        return;
      }

      if (!clerkUser) {
        logger.auth.loading('No Clerk user');
        setUser(null);
        setLoading(false);
        return;
      }

      logger.auth.loading(`Fetching MongoDB user for Clerk ID: ${clerkUser.id}`);

      try {
        // Get Clerk session token
        const token = await getToken();
        
        if (!token) {
          logger.auth.error('Token retrieval', 'No token available');
          setUser(null);
          setLoading(false);
          return;
        }

        // Set auth token for API client
        setAuthToken(token);

        // Fetch user from MongoDB
        const response = await apiClient.get('/api/auth/me');
        logger.auth.success('MongoDB user fetch', response.data.user);
        setUser(response.data.user);
        setRetryCount(0); // Reset retry count on success
        setLoading(false); // Success: stop loading
        
        // Clear timeout on success
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
          setLoadingTimeout(null);
        }
      } catch (error: any) {
        logger.auth.error('User fetch', error);
        
        // If user not found (404 or 401) and we haven't retried too many times, retry
        // 401 can happen when user is being created in MongoDB
        const shouldRetry = (error.response?.status === 404 || error.response?.status === 401) && 
                           retryCount < RETRY_CONFIG.MAX_ATTEMPTS;
        
        if (shouldRetry) {
          const statusMessage = error.response?.status === 401 ? 'Unauthorized' : 'User not found';
          logger.warn(`${statusMessage} in MongoDB, retrying (${retryCount + 1}/${RETRY_CONFIG.MAX_ATTEMPTS})`);
          logger.info('This is normal for new signups - user is being created...');
          
          // Schedule retry without blocking
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, RETRY_CONFIG.DELAY_MS);
          
          // Keep loading state true for retries
          return;
        }
        
        // After max retries or non-retryable error, use Clerk data as fallback
        logger.warn('Using Clerk data as fallback', { 
          reason: retryCount >= RETRY_CONFIG.MAX_ATTEMPTS ? 'max_retries' : 'non_retryable_error',
          errorStatus: error.response?.status 
        });
        
        const clerkRole = (clerkUser.publicMetadata?.role || clerkUser.unsafeMetadata?.role) as 'Freelancer' | 'BusinessOwner' | undefined;
        const fallbackUser: User = {
          _id: '',
          clerkId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          role: clerkRole || 'Freelancer',
          profilePicture: clerkUser.imageUrl,
          isActive: true,
          isEmailVerified: clerkUser.primaryEmailAddress?.verification?.status === 'verified',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(fallbackUser);
        logger.warn('Fallback user role', { role: clerkRole, source: 'retry_exhaustion' });
        
        // Always set loading to false when done retrying
        setLoading(false);
        
        // Clear timeout on error resolution
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
          setLoadingTimeout(null);
        }
      }
    };

    fetchMongoUser();
  }, [clerkUser, clerkLoaded, getToken, retryCount]);

  // Refresh user data from MongoDB
  const refreshUser = async () => {
    if (!clerkUser) return;

    try {
      const token = await getToken();
      if (!token) return;

      setAuthToken(token);
      const response = await apiClient.get('/api/auth/me');
      setUser(response.data.user);
      logger.auth.success('User data refreshed');
    } catch (error) {
      logger.auth.error('User refresh', error);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setAuthToken(null); // Clear auth token
      logger.info('User logged out successfully');
    } catch (error) {
      logger.error('Logout error', error);
    }
  };

  const value: AuthContextType = {
    user,
    clerkUser,
    loading,
    isAuthenticated: !!clerkUser && !!user,
    isEmailVerified: user?.isEmailVerified || false,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
