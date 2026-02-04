import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Code2 } from 'lucide-react';

const FreelancerSignup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'India', 'Australia', 'Other'];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup({
        email: formData.email,
        password: 'temp-password-' + Math.random().toString(36),
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'Freelancer',
        country: formData.country
      });
      
      // Show success message about verification email
      navigate('/auth/verify-email', { state: { email: formData.email } });
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
            <Code2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Freelancer Sign Up</CardTitle>
          <CardDescription className="text-center">
            Enter your details - we'll send you a verification link
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select 
                value={formData.country} 
                onValueChange={(value) => handleChange('country', value)}
                disabled={loading}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800 text-sm">
                You'll receive a verification link via email to activate your account
              </AlertDescription>
            </Alert>
                required
                minLength={6}
                disabled={loading}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Freelancer Account'
              )}
            </Button>
            
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Button 
                type="button"
                variant="link" 
                className="p-0 h-auto font-medium"
                onClick={() => navigate('/auth/signin')}
              >
                Sign in
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default FreelancerSignup;
