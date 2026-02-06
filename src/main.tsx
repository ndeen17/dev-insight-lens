import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { validateEnvironment } from '@/utils/env';
import { logger } from '@/utils/logger';
import { ROUTES } from '@/config/constants';
import App from './App.tsx';
import './index.css';

// Validate environment variables before app initialization
try {
  const env = validateEnvironment();
  
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ClerkProvider 
        publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY} 
        afterSignOutUrl={ROUTES.HOME}
        signInUrl={ROUTES.SIGN_IN}
        signUpUrl={ROUTES.SIGN_UP}
      >
        <App />
      </ClerkProvider>
    </StrictMode>
  );
} catch (error) {
  logger.error('Failed to initialize application', error);
  // Show user-friendly error message
  document.getElementById("root")!.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; padding: 20px; text-align: center;">
      <div>
        <h1 style="color: #ef4444; margin-bottom: 16px;">Configuration Error</h1>
        <p style="color: #64748b;">Please check your environment configuration and try again.</p>
      </div>
    </div>
  `;
}
