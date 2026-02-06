import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, X, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/config/constants';

const EmailVerificationBanner = () => {
  const { user: clerkUser } = useUser();
  const { isEmailVerified, refreshUser } = useAuth();
  const { toast } = useToast();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const [justVerified, setJustVerified] = useState(false);

  // Check if email is verified from Clerk directly
  const emailAddress = clerkUser?.primaryEmailAddress;
  const isVerified = emailAddress?.verification?.status === 'verified' || isEmailVerified;

  // Poll for verification status changes
  useEffect(() => {
    if (isVerified || dismissed) return;

    const pollInterval = setInterval(async () => {
      try {
        await clerkUser?.reload();
        const nowVerified = clerkUser?.primaryEmailAddress?.verification?.status === 'verified';
        if (nowVerified) {
          setJustVerified(true);
          refreshUser();
          toast({
            title: 'Email Verified!',
            description: 'Your email has been successfully verified.',
          });
          // Auto-dismiss after showing success
          setTimeout(() => setDismissed(true), 5000);
        }
      } catch {
        // Silent fail on polling
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(pollInterval);
  }, [isVerified, dismissed, clerkUser, refreshUser, toast]);

  // Don't show if verified, dismissed, or no user
  if (isVerified && !justVerified) return null;
  if (dismissed) return null;
  if (!clerkUser) return null;

  const handleResendVerification = async () => {
    if (!emailAddress) return;

    try {
      setSending(true);
      const verifyUrl = `${window.location.origin}${ROUTES.EMAIL_VERIFIED}`;
      await emailAddress.prepareVerification({ strategy: 'email_link', redirectUrl: verifyUrl });
      toast({
        title: 'Verification email sent!',
        description: `Check your inbox at ${emailAddress.emailAddress}`,
      });
    } catch (error: any) {
      toast({
        title: 'Failed to send verification',
        description: error?.errors?.[0]?.longMessage || error?.message || 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  // Show success state briefly
  if (justVerified) {
    return (
      <div className="mx-6 mt-4 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4 flex items-center gap-3 shadow-sm animate-in slide-in-from-top-2">
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
        <p className="text-sm font-medium text-green-800 dark:text-green-200">
          Email verified successfully! You now have full access to all features.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-6 mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                Please verify your email address
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                We sent a verification email to{' '}
                <span className="font-medium">{emailAddress?.emailAddress}</span>.
                Verify to unlock all features like creating contracts and managing projects.
              </p>
            </div>
            
            <button
              onClick={() => setDismissed(true)}
              className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-200 p-1 rounded transition-colors flex-shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleResendVerification}
              disabled={sending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 dark:text-amber-100 bg-amber-200 dark:bg-amber-800 hover:bg-amber-300 dark:hover:bg-amber-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Mail className="w-3.5 h-3.5" />
              )}
              {sending ? 'Sending...' : 'Resend verification email'}
            </button>
            
            <button
              onClick={async () => {
                await clerkUser?.reload();
                const nowVerified = clerkUser?.primaryEmailAddress?.verification?.status === 'verified';
                if (nowVerified) {
                  setJustVerified(true);
                  refreshUser();
                } else {
                  toast({
                    title: 'Not yet verified',
                    description: 'Please check your email and click the verification link.',
                  });
                }
              }}
              className="text-xs text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 underline transition-colors"
            >
              I've already verified
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
