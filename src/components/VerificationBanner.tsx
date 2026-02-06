import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';

export const VerificationBanner = () => {
  const { user } = useUser();
  const [resending, setResending] = useState(false);

  // Check if email is verified
  const primaryEmail = user?.emailAddresses?.find(
    email => email.id === user.primaryEmailAddressId
  );
  const isVerified = primaryEmail?.verification?.status === 'verified';

  // Don't show banner if already verified
  if (isVerified) {
    return null;
  }

  const handleResend = async () => {
    setResending(true);
    try {
      // Clerk automatically handles resending verification emails
      await primaryEmail?.prepareVerification({ strategy: 'email_code' });
      // Show success message (you can add a toast notification here)
      alert('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Failed to resend verification:', error);
      alert('Failed to resend verification email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
      <Mail className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-yellow-800 dark:text-yellow-200">
          <strong>Email verification pending.</strong> Please check your inbox and verify your email to unlock all features.
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResend}
          disabled={resending}
          className="ml-4 border-yellow-300 hover:bg-yellow-100 dark:border-yellow-700 dark:hover:bg-yellow-900/40"
        >
          {resending ? (
            <>
              <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
              Sending...
            </>
          ) : (
            'Resend Email'
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
};
