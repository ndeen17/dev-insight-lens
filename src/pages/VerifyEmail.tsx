import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle } from 'lucide-react';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'your email';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent a verification link to your email
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <Mail className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong className="block mb-1">Verification email sent to:</strong>
              <span className="font-mono text-sm">{email}</span>
            </AlertDescription>
          </Alert>

          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p className="font-medium">Next steps:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Open your email inbox</li>
              <li>Click the verification link in our email</li>
              <li>You'll be automatically logged in</li>
            </ol>
          </div>

          <Alert>
            <AlertDescription className="text-sm">
              <strong>Didn't receive the email?</strong>
              <br />
              Check your spam folder or wait a few minutes for it to arrive.
            </AlertDescription>
          </Alert>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
