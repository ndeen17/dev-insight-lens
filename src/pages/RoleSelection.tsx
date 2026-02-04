import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Code2 } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Join Artemis</h1>
          <p className="text-lg text-muted-foreground">
            Choose how you want to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Freelancer Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Code2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">I'm a Freelancer</CardTitle>
              <CardDescription className="text-base">
                Find remote work opportunities, showcase your skills, and get hired by top companies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Get evaluated and ranked on the leaderboard
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Take skill tests to prove your expertise
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Manage contracts and get paid securely
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Build your professional reputation
                </li>
              </ul>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate('/auth/signup/freelancer')}
              >
                Sign up as Freelancer
              </Button>
            </CardContent>
          </Card>

          {/* Business Owner Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-2xl">I'm Hiring</CardTitle>
              <CardDescription className="text-base">
                Find and hire top-tier developers, manage contracts, and build your remote team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Browse and evaluate developer profiles
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Test candidates with coding challenges
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Create and manage project contracts
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Track milestones and approve payments
                </li>
              </ul>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate('/auth/signup/business')}
              >
                Sign up as Employer
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium"
              onClick={() => navigate('/auth/signin')}
            >
              Sign in
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
