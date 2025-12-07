import axios from 'axios';
import { appConfig } from '../config/index.js';

// API configuration for backend integration
const API_BASE_URL = appConfig.apiUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: appConfig.requestTimeout,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for debugging in development
if (appConfig.enableDebugLogs) {
  api.interceptors.request.use(
    (config) => {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config);
      return config;
    },
    (error) => {
      console.error('❌ API Request Error:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log(`✅ API Response: ${response.status}`, response.data);
      return response;
    },
    (error) => {
      console.error('❌ API Response Error:', error.response || error);
      return Promise.reject(error);
    }
  );
}

// Centralized error handler
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400: 
        throw new Error(data.error || data.message || 'Invalid request data');
      case 401:
        throw new Error('Authentication required');
      case 403:
        throw new Error('Access denied');
      case 404: 
        throw new Error(data.error || 'GitHub user not found or profile is private');
      case 429: 
        const retryAfter = error.response.headers['retry-after'];
        const waitTime = retryAfter ? `${retryAfter} seconds` : '15 minutes';
        throw new Error(`Rate limit exceeded. Please try again in ${waitTime}`);
      case 500: 
        throw new Error(data.error || 'Analysis service temporarily unavailable');
      case 502:
      case 503:
      case 504:
        throw new Error('Backend service unavailable. Please try again later');
      default: 
        throw new Error(data.error || data.message || `Server error (${status})`);
    }
  } else if (error.code === 'ECONNABORTED') {
    throw new Error('Request timeout. The analysis is taking too long. Please try again');
  } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    throw new Error('Network error. Please check your internet connection');
  } else {
    throw new Error(error.message || 'Unable to connect to the backend service');
  }
};

export const analyzeGitHubProfile = async (githubUrl) => {
  try {
    // Validate GitHub URL format
    if (!appConfig.validation.githubUrlPattern.test(githubUrl)) {
      throw new Error('Please enter a valid GitHub profile URL');
    }

    // Make API call to backend
    const response = await api.post(appConfig.endpoints.analyze, {
      github_url: githubUrl.trim(), // Updated to match new backend spec
      githubUrl: githubUrl.trim()   // Keep legacy for backward compatibility
    });

    // The response will contain either:
    // - New format: { profile, scores, recruiter_summary, engineer_breakdown }
    // - Legacy format: { grade, reasoning, strengths, weaknesses, suggestions, analyzedRepos, totalRepos }
    // The frontend will handle both formats automatically
    
    return response;

  } catch (error) {
    handleApiError(error);
  }
};

export const checkBackendHealth = async () => {
  try {
    const response = await api.get(appConfig.endpoints.health);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Additional GitHub API endpoints based on your backend structure
export const fetchGitHubData = async (endpoint, params = {}) => {
  try {
    const response = await api.get(`${appConfig.endpoints.github}/${endpoint}`, { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};