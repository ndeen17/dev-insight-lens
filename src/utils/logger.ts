/**
 * Application Logger
 * Centralized logging utility with environment-aware behavior
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (!this.isDevelopment && level === 'debug') {
      return; // Don't log debug messages in production
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'error':
        console.error(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'debug':
        console.log(prefix, message, ...args);
        break;
    }
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }

  // Auth specific logging
  auth = {
    signUp: (context: string, data?: any) => {
      this.debug(`Auth: SignUp - ${context}`, data);
    },
    signIn: (context: string, data?: any) => {
      this.debug(`Auth: SignIn - ${context}`, data);
    },
    loading: (context: string) => {
      this.debug(`Auth: ${context} - Loading...`);
    },
    success: (context: string, data?: any) => {
      this.debug(`Auth: ${context} - Success`, data);
    },
    error: (context: string, error: any) => {
      this.error(`Auth: ${context} - Error`, error);
    },
  };

  // API specific logging
  api = {
    request: (endpoint: string, method: string) => {
      this.debug(`API: ${method} ${endpoint}`);
    },
    response: (endpoint: string, status: number) => {
      this.debug(`API: Response from ${endpoint} - Status: ${status}`);
    },
    error: (endpoint: string, error: any) => {
      this.error(`API: Error from ${endpoint}`, error);
    },
  };
}

export const logger = new Logger();
