/**
 * Environment Validation
 * Validates required environment variables at app startup
 */

import { logger } from '@/utils/logger';

interface EnvConfig {
  VITE_CLERK_PUBLISHABLE_KEY: string;
  VITE_API_URL: string;
}

const requiredEnvVars: (keyof EnvConfig)[] = [
  'VITE_CLERK_PUBLISHABLE_KEY',
  'VITE_API_URL',
];

export function validateEnvironment(): EnvConfig {
  const missingVars: string[] = [];
  const config: Partial<EnvConfig> = {};

  for (const varName of requiredEnvVars) {
    const value = import.meta.env[varName];
    
    if (!value) {
      missingVars.push(varName);
    } else {
      config[varName] = value as string;
    }
  }

  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  // Validate Clerk key format
  if (config.VITE_CLERK_PUBLISHABLE_KEY && 
      !config.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_')) {
    const error = 'Invalid Clerk publishable key format. Must start with pk_';
    logger.error(error);
    throw new Error(error);
  }

  logger.info('Environment validation successful');
  
  return config as EnvConfig;
}

export function getEnvConfig(): EnvConfig {
  return {
    VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
    VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  };
}
