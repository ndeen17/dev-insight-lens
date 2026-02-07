/**
 * Application configuration based on environment
 */

interface EnvConfig {
  apiUrl: string;
  enableDebugLogs: boolean;
  enableHealthCheck: boolean;
  healthCheckInterval: number;
  requestTimeout: number;
  retryAttempts: number;
}

const config: Record<string, EnvConfig> = {
  development: {
    apiUrl: 'http://localhost:5000',
    enableDebugLogs: true,
    enableHealthCheck: true,
    healthCheckInterval: 5 * 60 * 1000, // 5 minutes
    requestTimeout: 60000, // 60 seconds
    retryAttempts: 3,
  },
  production: {
    apiUrl: import.meta.env.VITE_API_URL || 'https://artemis-backend-mx4u.onrender.com',
    enableDebugLogs: false,
    enableHealthCheck: true,
    healthCheckInterval: 10 * 60 * 1000, // 10 minutes
    requestTimeout: 30000, // 30 seconds
    retryAttempts: 2,
  },
  test: {
    apiUrl: 'http://localhost:5001',
    enableDebugLogs: false,
    enableHealthCheck: false,
    healthCheckInterval: 0,
    requestTimeout: 10000, // 10 seconds
    retryAttempts: 1,
  }
};

const env = import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development';

export const appConfig = {
  ...config[env],
  environment: env,
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // API endpoints
  endpoints: {
    health: '/health',
    analyze: '/api/evaluate',
    github: '/api',
  },
  
  // UI configuration
  ui: {
    showHealthStatus: true,
    enableRetryCountdown: true,
    maxRetryAttempts: config[env].retryAttempts,
  },
  
  // Validation patterns
  validation: {
    githubUrlPattern: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-_]+\/?$/,
    usernamePattern: /^[a-zA-Z0-9-_]+$/,
  }
};

export default appConfig;
