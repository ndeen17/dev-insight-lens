/**
 * API Client
 * Dedicated axios instance for backend API calls
 * Prevents token pollution to global axios instance
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/config/constants';
import { logger } from '@/utils/logger';

// Token refresh callback - will be set by AuthContext
let tokenRefreshCallback: (() => Promise<string | null>) | null = null;

// Track if we're currently refreshing to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  
  failedQueue = [];
};

/**
 * Set token refresh callback
 * Should be called by AuthContext with Clerk's getToken function
 */
export const setTokenRefreshCallback = (callback: () => Promise<string | null>) => {
  tokenRefreshCallback = callback;
};

// Create dedicated axios instance for our API
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds correlation ID
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add correlation ID for request tracing
    const correlationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    config.headers['X-Correlation-ID'] = correlationId;
    
    return config;
  },
  (error: AxiosError) => {
    logger.error('API request error', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handles common errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    
    // Log errors
    if (status && status >= 500) {
      logger.error('API server error', {
        status,
        url: error.config?.url,
        message: error.message,
      });
    }
    
    // Handle 401 Unauthorized - attempt token refresh
    if (status === 401 && !originalRequest._retry) {
      if (!tokenRefreshCallback) {
        logger.warn('Token refresh callback not set - cannot refresh token');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request new token from Clerk
        const newToken = await tokenRefreshCallback();
        
        if (newToken) {
          // Update token in apiClient
          setAuthToken(newToken);
          
          // Process queued requests
          processQueue(null, newToken);
          
          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          }
          
          logger.debug('Token refreshed successfully, retrying request');
          return apiClient(originalRequest);
        } else {
          // No token obtained, reject all queued requests
          const tokenError = new Error('Failed to refresh token');
          processQueue(tokenError, null);
          return Promise.reject(tokenError);
        }
      } catch (refreshError) {
        logger.error('Token refresh failed', refreshError);
        processQueue(refreshError as Error, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Validate that a string looks like a JWT (three base64 segments separated by dots)
 */
const isValidJwtFormat = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
};

/**
 * Set authentication token for API requests
 */
export const setAuthToken = (token: string | null) => {
  if (token && isValidJwtFormat(token)) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    logger.debug('Auth token set for API client');
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    if (token) {
      logger.warn('Invalid JWT format received, token not set', { 
        tokenLength: token.length,
        tokenPreview: token.substring(0, 20) + '...'
      });
    } else {
      logger.debug('Auth token removed from API client');
    }
  }
};

/**
 * Get current auth token from API client
 */
export const getAuthToken = (): string | null => {
  const authHeader = apiClient.defaults.headers.common['Authorization'];
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

export default apiClient;
