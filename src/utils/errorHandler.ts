/**
 * Centralized error handling utilities for the application
 */

/**
 * Handles API errors and returns user-friendly messages
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */
export const handleApiError = (error) => {
  // Log error for debugging in development
  if (import.meta.env.VITE_NODE_ENV === 'development') {
    console.error('API Error:', error);
  }

  if (error.response) {
    // Server responded with a status other than 2xx
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.error || data.message || 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'Access denied. You don\'t have permission to perform this action.';
      case 404:
        return data.error || 'Resource not found. Please check the GitHub URL.';
      case 429:
        const retryAfter = error.response.headers['retry-after'];
        const waitTime = retryAfter ? `${retryAfter} seconds` : '15 minutes';
        return `Too many requests. Please try again in ${waitTime}.`;
      case 500:
        return data.error || 'Internal server error. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return data.error || data.message || `Server error (${status}). Please try again.`;
    }
  } else if (error.request) {
    // No response received
    return 'No response from server. Please check your internet connection.';
  } else {
    // Other errors (e.g., network errors, timeouts)
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. The operation took too long. Please try again.';
    }
    
    return error.message || 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Validates GitHub URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const isValidGitHubUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-_]+\/?$/;
  return githubUrlPattern.test(url.trim());
};

/**
 * Extracts username from GitHub URL
 * @param {string} url - The GitHub URL
 * @returns {string|null} - The username or null if invalid
 */
export const extractGitHubUsername = (url) => {
  if (!isValidGitHubUrl(url)) return null;
  
  const match = url.match(/github\.com\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
};

/**
 * Formats error message for display
 * @param {string} message - The error message
 * @returns {string} - Formatted error message
 */
export const formatErrorMessage = (message) => {
  if (!message) return 'An unknown error occurred.';
  
  // Capitalize first letter if not already
  return message.charAt(0).toUpperCase() + message.slice(1);
};

/**
 * Checks if error is a rate limit error
 * @param {Error} error - The error object
 * @returns {boolean} - Whether it's a rate limit error
 */
export const isRateLimitError = (error) => {
  return error.response?.status === 429 || 
         error.message?.toLowerCase().includes('rate limit') ||
         error.message?.toLowerCase().includes('too many requests');
};

/**
 * Checks if error is a network/connectivity error
 * @param {Error} error - The error object
 * @returns {boolean} - Whether it's a network error
 */
export const isNetworkError = (error) => {
  return !error.response || 
         error.code === 'NETWORK_ERROR' ||
         error.message?.includes('Network Error') ||
         error.code === 'ECONNABORTED';
};
